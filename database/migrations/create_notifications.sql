-- ========================================
-- NOTIFICATIONS TABLE
-- ========================================
-- Production-ready notifications system
-- Compatible with Supabase PostgreSQL

-- Create notification type enum for type safety
CREATE TYPE notification_type AS ENUM (
  'like',
  'comment',
  'answer',
  'follow',
  'mention',
  'new_post'
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('question', 'answer', 'comment', 'profile')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE notifications IS 'User notifications for activity on posts, comments, follows, etc.';
COMMENT ON COLUMN notifications.user_id IS 'User receiving the notification';
COMMENT ON COLUMN notifications.actor_id IS 'User who triggered the notification';
COMMENT ON COLUMN notifications.entity_id IS 'ID of the related entity (question, answer, etc.)';
COMMENT ON COLUMN notifications.entity_type IS 'Type of entity: question, answer, comment, profile';
COMMENT ON COLUMN notifications.type IS 'Type of notification: like, comment, answer, follow, mention, new_post';

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_actor_id ON notifications(actor_id);
CREATE INDEX idx_notifications_entity ON notifications(entity_id, entity_type);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES FOR NOTIFICATIONS
-- ========================================

-- Users can only read their own notifications
CREATE POLICY "notifications_select_policy" 
ON notifications FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only update their own notifications (mark as read)
CREATE POLICY "notifications_update_policy" 
ON notifications FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only the system can insert notifications (via triggers or backend)
-- No direct INSERT policy for users - notifications created via triggers

-- Users can delete their own notifications
CREATE POLICY "notifications_delete_policy" 
ON notifications FOR DELETE 
USING (auth.uid() = user_id);

-- ========================================
-- TRIGGER FUNCTIONS FOR AUTO NOTIFICATIONS
-- ========================================

-- Function to create notification for vote/like
CREATE OR REPLACE FUNCTION notify_on_vote()
RETURNS TRIGGER AS $$
DECLARE
  v_entity_owner UUID;
  v_entity_type TEXT;
  v_entity_title TEXT;
  v_actor_name TEXT;
BEGIN
  -- Don't notify if user votes on their own content
  IF NEW.votable_type = 'question' THEN
    SELECT user_id, title INTO v_entity_owner, v_entity_title
    FROM questions
    WHERE id = NEW.votable_id;
    v_entity_type := 'question';
  ELSIF NEW.votable_type = 'answer' THEN
    SELECT user_id INTO v_entity_owner
    FROM answers
    WHERE id = NEW.votable_id;
    v_entity_type := 'answer';
    v_entity_title := 'your answer';
  END IF;

  -- Only create notification for upvotes (value = 1)
  IF NEW.value = 1 AND v_entity_owner IS NOT NULL AND v_entity_owner != NEW.user_id THEN
    -- Get actor name
    SELECT full_name INTO v_actor_name
    FROM profiles
    WHERE id = NEW.user_id;

    INSERT INTO notifications (
      user_id,
      actor_id,
      type,
      entity_id,
      entity_type,
      message
    ) VALUES (
      v_entity_owner,
      NEW.user_id,
      'like',
      NEW.votable_id,
      v_entity_type,
      COALESCE(v_actor_name, 'Someone') || ' liked your ' || v_entity_type
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification for answers
CREATE OR REPLACE FUNCTION notify_on_answer()
RETURNS TRIGGER AS $$
DECLARE
  v_question_owner UUID;
  v_question_title TEXT;
  v_actor_name TEXT;
BEGIN
  -- Get question owner
  SELECT user_id, title INTO v_question_owner, v_question_title
  FROM questions
  WHERE id = NEW.question_id;

  -- Don't notify if answering own question
  IF v_question_owner IS NOT NULL AND v_question_owner != NEW.user_id THEN
    -- Get actor name
    SELECT full_name INTO v_actor_name
    FROM profiles
    WHERE id = NEW.user_id;

    INSERT INTO notifications (
      user_id,
      actor_id,
      type,
      entity_id,
      entity_type,
      message
    ) VALUES (
      v_question_owner,
      NEW.user_id,
      'answer',
      NEW.question_id,
      'question',
      COALESCE(v_actor_name, 'Someone') || ' answered your question: ' || COALESCE(v_question_title, '')
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- CREATE TRIGGERS
-- ========================================

-- Trigger for vote notifications
CREATE TRIGGER on_vote_notification
  AFTER INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_vote();

-- Trigger for answer notifications
CREATE TRIGGER on_answer_notification
  AFTER INSERT ON answers
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_answer();

-- ========================================
-- HELPER FUNCTIONS
-- ========================================

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET is_read = TRUE, updated_at = NOW()
  WHERE user_id = p_user_id AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM notifications
    WHERE user_id = p_user_id AND is_read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
