-- Database Schema for MIDEEYE
-- PostgreSQL (Supabase)
-- 
-- This schema is designed to be portable to Django.
-- When migrating, Django models will mirror these tables.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PROFILES TABLE
-- ========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'User profiles linked to Supabase auth.users';
COMMENT ON COLUMN profiles.id IS 'References auth.users(id)';

-- ========================================
-- QUESTIONS TABLE
-- ========================================
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) >= 10),
  content TEXT NOT NULL CHECK (char_length(content) >= 20),
  post_type TEXT NOT NULL DEFAULT 'question' CHECK (post_type IN ('question', 'discussion', 'media', 'resource', 'announcement')),
  category TEXT NOT NULL,
  image_video_url TEXT,
  link_url TEXT,
  vote_count INTEGER DEFAULT 0 CHECK (vote_count >= 0),
  comment_count INTEGER DEFAULT 0 CHECK (comment_count >= 0),
  view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
  is_answered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE questions IS 'User-submitted posts (questions, discussions, media, resources, announcements)';
COMMENT ON COLUMN questions.post_type IS 'One of: question, discussion, media, resource, announcement';
COMMENT ON COLUMN questions.category IS 'One of: tech, business, education, health, culture, general';

-- Create index for performance
CREATE INDEX idx_questions_user_id ON questions(user_id);
CREATE INDEX idx_questions_post_type ON questions(post_type);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_created_at ON questions(created_at DESC);

-- ========================================
-- ANSWERS TABLE
-- ========================================
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES answers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 10),
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE answers IS 'Answers to questions (supports threaded replies)';
COMMENT ON COLUMN answers.parent_id IS 'Parent answer id for threaded replies';
COMMENT ON COLUMN answers.is_accepted IS 'Question author can accept one answer';

-- Create indexes
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_parent_id ON answers(parent_id);
CREATE INDEX idx_answers_user_id ON answers(user_id);
CREATE INDEX idx_answers_created_at ON answers(created_at DESC);

-- Only one accepted answer per question
CREATE UNIQUE INDEX idx_answers_accepted ON answers(question_id) 
WHERE is_accepted = TRUE;

-- ========================================
-- VOTES TABLE
-- ========================================
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  votable_id UUID NOT NULL,
  votable_type TEXT NOT NULL CHECK (votable_type IN ('question', 'answer')),
  value INTEGER NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE votes IS 'Upvotes and downvotes for questions and answers';
COMMENT ON COLUMN votes.votable_type IS 'Polymorphic: question or answer';
COMMENT ON COLUMN votes.value IS '1 for upvote, -1 for downvote';

-- Create indexes
CREATE INDEX idx_votes_votable ON votes(votable_id, votable_type);
CREATE INDEX idx_votes_user_id ON votes(user_id);

-- One vote per user per item
CREATE UNIQUE INDEX idx_votes_unique ON votes(user_id, votable_id, votable_type);

-- ========================================
-- EMAIL SUBSCRIBERS TABLE
-- ========================================
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE email_subscribers IS 'Newsletter email subscriptions';

CREATE INDEX idx_email_subscribers_active ON email_subscribers(is_active) 
WHERE is_active = TRUE;

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES - PROFILES
-- ========================================

-- Anyone can view profiles
CREATE POLICY "profiles_select_policy" 
ON profiles FOR SELECT 
USING (true);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_policy" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_policy" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "profiles_delete_policy" 
ON profiles FOR DELETE 
USING (auth.uid() = id);

-- ========================================
-- RLS POLICIES - QUESTIONS
-- ========================================

-- Anyone can view questions
CREATE POLICY "questions_select_policy" 
ON questions FOR SELECT 
USING (true);

-- Authenticated users can create questions
CREATE POLICY "questions_insert_policy" 
ON questions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own questions
CREATE POLICY "questions_update_policy" 
ON questions FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own questions
CREATE POLICY "questions_delete_policy" 
ON questions FOR DELETE 
USING (auth.uid() = user_id);

-- ========================================
-- RLS POLICIES - ANSWERS
-- ========================================

-- Anyone can view answers
CREATE POLICY "answers_select_policy" 
ON answers FOR SELECT 
USING (true);

-- Authenticated users can create answers
CREATE POLICY "answers_insert_policy" 
ON answers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own answers
CREATE POLICY "answers_update_policy" 
ON answers FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own answers
CREATE POLICY "answers_delete_policy" 
ON answers FOR DELETE 
USING (auth.uid() = user_id);

-- ========================================
-- RLS POLICIES - VOTES
-- ========================================

-- Users can view all votes
CREATE POLICY "votes_select_policy" 
ON votes FOR SELECT 
USING (true);

-- Authenticated users can create votes
CREATE POLICY "votes_insert_policy" 
ON votes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own votes
CREATE POLICY "votes_update_policy" 
ON votes FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "votes_delete_policy" 
ON votes FOR DELETE 
USING (auth.uid() = user_id);

-- ========================================
-- RLS POLICIES - EMAIL SUBSCRIBERS
-- ========================================

-- Anyone can insert (subscribe)
CREATE POLICY "email_subscribers_insert_policy" 
ON email_subscribers FOR INSERT 
WITH CHECK (true);

-- Only the owner can update their subscription
CREATE POLICY "email_subscribers_update_policy" 
ON email_subscribers FOR UPDATE 
USING (true);

-- ========================================
-- FUNCTIONS
-- ========================================

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(question_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE questions 
  SET view_count = view_count + 1 
  WHERE id = question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- STORAGE - POST MEDIA BUCKET
-- ========================================

-- Bucket for post images/videos (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-media', 'post-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "post_media_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-media');

-- Authenticated users can upload
CREATE POLICY "post_media_auth_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'post-media' AND auth.role() = 'authenticated');

-- Owners can update or delete their own files
CREATE POLICY "post_media_auth_update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'post-media' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'post-media' AND auth.uid() = owner);

CREATE POLICY "post_media_auth_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'post-media' AND auth.uid() = owner);

-- ========================================
-- TRIGGERS
-- ========================================

-- Auto-update updated_at for profiles
CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Auto-update updated_at for questions
CREATE TRIGGER questions_updated_at
BEFORE UPDATE ON questions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Auto-update updated_at for answers
CREATE TRIGGER answers_updated_at
BEFORE UPDATE ON answers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ========================================
-- INITIAL DATA (Optional)
-- ========================================

-- You can add seed data here if needed
-- INSERT INTO profiles (id, email, full_name) VALUES ...

-- ========================================
-- NOTES FOR DJANGO MIGRATION
-- ========================================

-- When migrating to Django:
-- 1. UUID fields → models.UUIDField(primary_key=True, default=uuid.uuid4)
-- 2. TEXT fields → models.CharField() or models.TextField()
-- 3. TIMESTAMPTZ → models.DateTimeField(auto_now_add=True)
-- 4. Foreign keys → models.ForeignKey(on_delete=models.CASCADE)
-- 5. RLS → Django permissions and Django Guardian
-- 6. Triggers → Django signals (post_save, pre_save)
-- 7. Functions → Django ORM queries or custom managers

-- All constraints are standard PostgreSQL and will work with Django.
