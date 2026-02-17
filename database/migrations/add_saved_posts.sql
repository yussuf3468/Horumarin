-- ============================================
-- SAVED POSTS SYSTEM
-- Allows users to bookmark/save posts for later
-- ============================================

-- Create saved_posts table
CREATE TABLE IF NOT EXISTS saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate saves
  UNIQUE(user_id, post_id)
);

-- Indexes for performance
CREATE INDEX idx_saved_posts_user_id ON saved_posts(user_id);
CREATE INDEX idx_saved_posts_post_id ON saved_posts(post_id);
CREATE INDEX idx_saved_posts_saved_at ON saved_posts(saved_at DESC);
CREATE INDEX idx_saved_posts_user_saved_at ON saved_posts(user_id, saved_at DESC);

-- Row Level Security
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own saved posts
CREATE POLICY saved_posts_select_own
  ON saved_posts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can save posts
CREATE POLICY saved_posts_insert_own
  ON saved_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unsave their own posts
CREATE POLICY saved_posts_delete_own
  ON saved_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Add saved_count to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS saved_count INTEGER DEFAULT 0;

-- Create trigger to update saved_count
CREATE OR REPLACE FUNCTION update_question_saved_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE questions
    SET saved_count = saved_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE questions
    SET saved_count = GREATEST(saved_count - 1, 0)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_question_saved_count_trigger
AFTER INSERT OR DELETE ON saved_posts
FOR EACH ROW
EXECUTE FUNCTION update_question_saved_count();

-- Comment: This migration adds a saved posts system with proper RLS policies
-- and automatic saved count tracking on questions.
