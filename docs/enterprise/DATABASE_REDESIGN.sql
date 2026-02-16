-- MIDEEYE Enterprise Schema v2 (migration blueprint)
-- Scale target: 10M users

-- =====================================================
-- 1) USERS / PROFILES (audit + moderation + soft delete)
-- =====================================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'active' CHECK (visibility IN ('active', 'under_review', 'removed', 'archived')),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by UUID,
  ADD COLUMN IF NOT EXISTS updated_by UUID,
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_profiles_role_visibility ON profiles(role, visibility);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active_at ON profiles(last_active_at DESC);

-- =====================================================
-- 2) POSTS (rename from questions strategically later)
-- =====================================================
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'active' CHECK (visibility IN ('active', 'under_review', 'removed', 'archived')),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by UUID,
  ADD COLUMN IF NOT EXISTS updated_by UUID,
  ADD COLUMN IF NOT EXISTS moderation_flags_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS score_hot DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS score_trending DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Composite indexes for feed and moderation workflows
CREATE INDEX IF NOT EXISTS idx_questions_feed_hot ON questions(visibility, category, score_hot DESC, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_questions_feed_trending ON questions(visibility, category, score_trending DESC, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_questions_feed_new ON questions(visibility, category, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_questions_author_created ON questions(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_questions_visibility_flags ON questions(visibility, moderation_flags_count DESC, created_at DESC);

-- =====================================================
-- 3) VOTE AGGREGATION STRATEGY
-- =====================================================
-- Keep append-only votes table, aggregate into counters and feed cache.
-- Ensure conflict-safe upserts with unique index.
CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_unique_v2 ON votes(user_id, votable_id, votable_type);
CREATE INDEX IF NOT EXISTS idx_votes_votable_time ON votes(votable_type, votable_id, created_at DESC);

-- =====================================================
-- 4) RATE LIMIT / SPAM TRACKING
-- =====================================================
CREATE TABLE IF NOT EXISTS rate_limit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_hash TEXT NOT NULL,
  action_type TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_started_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_events_lookup ON rate_limit_events(action_type, ip_hash, window_started_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_events_user_lookup ON rate_limit_events(user_id, action_type, window_started_at DESC);

-- =====================================================
-- 5) MODERATION / GOVERNANCE FOUNDATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS moderation_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'answer', 'user')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'triaged', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_moderation_reports_status_time ON moderation_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_reports_target ON moderation_reports(target_type, target_id, created_at DESC);

CREATE TABLE IF NOT EXISTS moderation_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  target_post_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('soft_ban', 'unban', 'hide_post', 'restore_post', 'archive_post')),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_actions_actor_time ON moderation_actions(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_target_time ON moderation_actions(target_user_id, created_at DESC);

-- =====================================================
-- 6) FEED MATERIALIZATION CACHE
-- =====================================================
CREATE TABLE IF NOT EXISTS feed_cache (
  post_id UUID PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  visibility TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  score_hot DOUBLE PRECISION NOT NULL DEFAULT 0,
  score_trending DOUBLE PRECISION NOT NULL DEFAULT 0,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_feed_cache_hot ON feed_cache(visibility, category, score_hot DESC, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_feed_cache_trending ON feed_cache(visibility, category, score_trending DESC, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_feed_cache_new ON feed_cache(visibility, category, created_at DESC) WHERE deleted_at IS NULL;

-- =====================================================
-- 7) HOT/TRENDING SCORING FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_hot_score(votes INTEGER, created_at TIMESTAMPTZ)
RETURNS DOUBLE PRECISION AS $$
DECLARE
  hours_since DOUBLE PRECISION;
BEGIN
  hours_since := EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600.0;
  RETURN (votes + 1) / POWER(hours_since + 2, 1.5);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_trending_score(votes INTEGER, comments INTEGER, views INTEGER, created_at TIMESTAMPTZ)
RETURNS DOUBLE PRECISION AS $$
DECLARE
  hours_since DOUBLE PRECISION;
  engagement DOUBLE PRECISION;
BEGIN
  hours_since := GREATEST(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600.0, 1);
  engagement := votes * 5 + comments * 3 + LEAST(views / 20.0, 50);
  RETURN engagement / POWER(hours_since, 1.2);
END;
$$ LANGUAGE plpgsql;

-- N+1 prevention: recommended view for post list + author
CREATE OR REPLACE VIEW v_posts_with_author AS
SELECT
  q.id,
  q.title,
  q.content,
  q.post_type,
  q.category,
  q.image_video_url,
  q.link_url,
  q.visibility,
  q.created_at,
  q.updated_at,
  q.user_id,
  p.full_name,
  p.avatar_url,
  fc.vote_count,
  fc.comment_count,
  fc.view_count,
  fc.score_hot,
  fc.score_trending
FROM questions q
JOIN profiles p ON p.id = q.user_id
LEFT JOIN feed_cache fc ON fc.post_id = q.id
WHERE q.deleted_at IS NULL
  AND q.visibility = 'active';
