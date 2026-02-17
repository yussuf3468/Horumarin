-- =====================================================
-- USER FOLLOWS / SOCIAL GRAPH
-- Production-grade follow system for Mideeye
-- =====================================================

-- =====================================================
-- USER FOLLOWS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT no_self_follow CHECK (follower_id != following_id),
  CONSTRAINT unique_follow UNIQUE(follower_id, following_id)
);

-- =====================================================
-- USER STATS TABLE (cached counts)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SUGGESTED FOLLOWS (simple recommendation engine)
-- =====================================================

CREATE TABLE IF NOT EXISTS suggested_follows (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  suggested_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score NUMERIC DEFAULT 0,
  reason VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (user_id, suggested_user_id),
  CONSTRAINT no_self_suggest CHECK (user_id != suggested_user_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Follows indexes
CREATE INDEX idx_follows_follower 
  ON user_follows(follower_id, created_at DESC);

CREATE INDEX idx_follows_following 
  ON user_follows(following_id, created_at DESC);

-- Compound index for mutual follow check
CREATE INDEX idx_follows_mutual 
  ON user_follows(follower_id, following_id);

-- Stats index
CREATE INDEX idx_user_stats_followers 
  ON user_stats(followers_count DESC);

-- Suggested follows index
CREATE INDEX idx_suggested_follows_user_score 
  ON suggested_follows(user_id, score DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Follows RLS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Anyone can view follows (public social graph)
CREATE POLICY "Anyone can view follows" 
  ON user_follows FOR SELECT 
  USING (TRUE);

-- Users can insert their own follows
CREATE POLICY "Users can follow others" 
  ON user_follows FOR INSERT 
  WITH CHECK (follower_id = auth.uid());

-- Users can delete their own follows
CREATE POLICY "Users can unfollow" 
  ON user_follows FOR DELETE 
  USING (follower_id = auth.uid());

-- User stats RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stats" 
  ON user_stats FOR SELECT 
  USING (TRUE);

CREATE POLICY "System can update stats" 
  ON user_stats FOR INSERT 
  WITH CHECK (TRUE);

CREATE POLICY "System can modify stats" 
  ON user_stats FOR UPDATE 
  USING (TRUE);

-- Suggested follows RLS
ALTER TABLE suggested_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own suggestions" 
  ON suggested_follows FOR SELECT 
  USING (user_id = auth.uid());

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Follow user
CREATE OR REPLACE FUNCTION follow_user(p_following_id UUID)
RETURNS UUID AS $$
DECLARE
  v_follow_id UUID;
BEGIN
  -- Insert follow
  INSERT INTO user_follows (follower_id, following_id)
  VALUES (auth.uid(), p_following_id)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_follow_id;

  -- Update stats
  IF v_follow_id IS NOT NULL THEN
    -- Increment follower's following count
    INSERT INTO user_stats (user_id, following_count)
    VALUES (auth.uid(), 1)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      following_count = user_stats.following_count + 1,
      updated_at = NOW();

    -- Increment following's followers count
    INSERT INTO user_stats (user_id, followers_count)
    VALUES (p_following_id, 1)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      followers_count = user_stats.followers_count + 1,
      updated_at = NOW();

    -- Create notification
    PERFORM create_notification(
      p_following_id,
      auth.uid(),
      'new_follower',
      NULL,
      NULL,
      NULL
    );
  END IF;

  RETURN v_follow_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Unfollow user
CREATE OR REPLACE FUNCTION unfollow_user(p_following_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_deleted BOOLEAN;
BEGIN
  -- Delete follow
  DELETE FROM user_follows
  WHERE follower_id = auth.uid() AND following_id = p_following_id
  RETURNING TRUE INTO v_deleted;

  -- Update stats
  IF v_deleted THEN
    -- Decrement follower's following count
    UPDATE user_stats
    SET 
      following_count = GREATEST(following_count - 1, 0),
      updated_at = NOW()
    WHERE user_id = auth.uid();

    -- Decrement following's followers count
    UPDATE user_stats
    SET 
      followers_count = GREATEST(followers_count - 1, 0),
      updated_at = NOW()
    WHERE user_id = p_following_id;
  END IF;

  RETURN COALESCE(v_deleted, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is following another user
CREATE OR REPLACE FUNCTION is_following(p_following_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_follows
    WHERE follower_id = auth.uid() AND following_id = p_following_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if mutual follow
CREATE OR REPLACE FUNCTION is_mutual_follow(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_follows
    WHERE follower_id = auth.uid() AND following_id = p_user_id
  ) AND EXISTS (
    SELECT 1 FROM user_follows
    WHERE follower_id = p_user_id AND following_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's followers
CREATE OR REPLACE FUNCTION get_followers(p_user_id UUID, p_limit INTEGER DEFAULT 20, p_offset INTEGER DEFAULT 0)
RETURNS TABLE(
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  is_following BOOLEAN,
  followed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    EXISTS(
      SELECT 1 FROM user_follows 
      WHERE follower_id = auth.uid() AND following_id = p.id
    ) as is_following,
    uf.created_at as followed_at
  FROM user_follows uf
  INNER JOIN profiles p ON uf.follower_id = p.id
  WHERE uf.following_id = p_user_id
  ORDER BY uf.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's following
CREATE OR REPLACE FUNCTION get_following(p_user_id UUID, p_limit INTEGER DEFAULT 20, p_offset INTEGER DEFAULT 0)
RETURNS TABLE(
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  is_following BOOLEAN,
  followed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    EXISTS(
      SELECT 1 FROM user_follows 
      WHERE follower_id = auth.uid() AND following_id = p.id
    ) as is_following,
    uf.created_at as followed_at
  FROM user_follows uf
  INNER JOIN profiles p ON uf.following_id = p.id
  WHERE uf.follower_id = p_user_id
  ORDER BY uf.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get suggested users to follow (simple algorithm)
CREATE OR REPLACE FUNCTION get_suggested_follows(p_limit INTEGER DEFAULT 10)
RETURNS TABLE(
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  mutual_count INTEGER,
  reason TEXT
) AS $$
BEGIN
  -- Algorithm: Suggest users followed by people you follow
  RETURN QUERY
  WITH user_following AS (
    SELECT following_id FROM user_follows WHERE follower_id = auth.uid()
  ),
  suggested AS (
    SELECT 
      uf.following_id as suggested_id,
      COUNT(*)::INTEGER as mutual_count
    FROM user_follows uf
    WHERE uf.follower_id IN (SELECT following_id FROM user_following)
      AND uf.following_id NOT IN (SELECT following_id FROM user_following)
      AND uf.following_id != auth.uid()
    GROUP BY uf.following_id
  )
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    s.mutual_count,
    CASE 
      WHEN s.mutual_count = 1 THEN 'Followed by someone you follow'
      ELSE 'Followed by ' || s.mutual_count || ' people you follow'
    END as reason
  FROM suggested s
  INNER JOIN profiles p ON s.suggested_id = p.id
  ORDER BY s.mutual_count DESC, RANDOM()
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get mutual followers
CREATE OR REPLACE FUNCTION get_mutual_followers(p_user_id UUID)
RETURNS TABLE(
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url
  FROM user_follows uf1
  INNER JOIN user_follows uf2 
    ON uf1.follower_id = uf2.follower_id
  INNER JOIN profiles p 
    ON uf1.follower_id = p.id
  WHERE uf1.following_id = auth.uid()
    AND uf2.following_id = p_user_id
    AND uf1.follower_id != auth.uid()
    AND uf1.follower_id != p_user_id
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS FOR MAINTAINING COUNTS
-- =====================================================

-- Initialize user stats on profile creation
CREATE OR REPLACE FUNCTION init_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_init_user_stats
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION init_user_stats();

-- Recalculate stats on demand
CREATE OR REPLACE FUNCTION recalculate_user_stats(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_stats (
    user_id, 
    followers_count, 
    following_count,
    posts_count,
    answers_count,
    updated_at
  )
  VALUES (
    p_user_id,
    (SELECT COUNT(*) FROM user_follows WHERE following_id = p_user_id),
    (SELECT COUNT(*) FROM user_follows WHERE follower_id = p_user_id),
    (SELECT COUNT(*) FROM questions WHERE user_id = p_user_id),
    (SELECT COUNT(*) FROM answers WHERE user_id = p_user_id),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    followers_count = EXCLUDED.followers_count,
    following_count = EXCLUDED.following_count,
    posts_count = EXCLUDED.posts_count,
    answers_count = EXCLUDED.answers_count,
    updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON user_follows TO authenticated;
GRANT ALL ON user_stats TO authenticated;
GRANT ALL ON suggested_follows TO authenticated;
GRANT EXECUTE ON FUNCTION follow_user TO authenticated;
GRANT EXECUTE ON FUNCTION unfollow_user TO authenticated;
GRANT EXECUTE ON FUNCTION is_following TO authenticated;
GRANT EXECUTE ON FUNCTION is_mutual_follow TO authenticated;
GRANT EXECUTE ON FUNCTION get_followers TO authenticated;
GRANT EXECUTE ON FUNCTION get_following TO authenticated;
GRANT EXECUTE ON FUNCTION get_suggested_follows TO authenticated;
GRANT EXECUTE ON FUNCTION get_mutual_followers TO authenticated;
GRANT EXECUTE ON FUNCTION recalculate_user_stats TO authenticated;
