-- ============================================
-- CATEGORY FOLLOW SYSTEM
-- Allows users to follow categories for personalized feed
-- ============================================

-- Create categories table (standardize existing categories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Icon name or emoji
  color TEXT, -- Hex color for UI theming
  follower_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
  ('Technology', 'tech', 'Software, hardware, AI, and tech innovation', '💻', '#3B82F6'),
  ('Business', 'business', 'Entrepreneurship, startups, and business strategy', '💼', '#8B5CF6'),
  ('Education', 'education', 'Learning, teaching, and educational resources', '📚', '#10B981'),
  ('Health', 'health', 'Wellness, fitness, mental health, and medical topics', '🏥', '#EF4444'),
  ('Culture', 'culture', 'Arts, entertainment, lifestyle, and society', '🎨', '#F59E0B'),
  ('General', 'general', 'General discussions and miscellaneous topics', '💬', '#6B7280')
ON CONFLICT (slug) DO NOTHING;

-- Create category_follows table
CREATE TABLE IF NOT EXISTS category_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate follows
  UNIQUE(user_id, category_id)
);

-- Indexes for performance
CREATE INDEX idx_category_follows_user_id ON category_follows(user_id);
CREATE INDEX idx_category_follows_category_id ON category_follows(category_id);
CREATE INDEX idx_category_follows_followed_at ON category_follows(followed_at DESC);

-- Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_follows ENABLE ROW LEVEL SECURITY;

-- Everyone can read categories
CREATE POLICY categories_select_all
  ON categories FOR SELECT
  USING (true);

-- Only admins can modify categories (for now, no INSERT/UPDATE/DELETE policies)

-- Users can see all category follows (for displaying follower counts)
CREATE POLICY category_follows_select_all
  ON category_follows FOR SELECT
  USING (true);

-- Users can follow categories
CREATE POLICY category_follows_insert_own
  ON category_follows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unfollow categories
CREATE POLICY category_follows_delete_own
  ON category_follows FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update category follower_count
CREATE OR REPLACE FUNCTION update_category_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE categories
    SET follower_count = follower_count + 1
    WHERE id = NEW.category_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE categories
    SET follower_count = GREATEST(follower_count - 1, 0)
    WHERE id = OLD.category_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_category_follower_count_trigger
AFTER INSERT OR DELETE ON category_follows
FOR EACH ROW
EXECUTE FUNCTION update_category_follower_count();

-- Create function to get user's followed categories
CREATE OR REPLACE FUNCTION get_user_followed_categories(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  icon TEXT,
  color TEXT,
  follower_count INTEGER,
  post_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.slug,
    c.description,
    c.icon,
    c.color,
    c.follower_count,
    c.post_count
  FROM categories c
  INNER JOIN category_follows cf ON c.id = cf.category_id
  WHERE cf.user_id = p_user_id
  ORDER BY cf.followed_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comment: This migration adds a category system with follow functionality
-- for personalized feed experiences.
