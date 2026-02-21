-- =====================================================
-- NOTIFICATIONS TABLE
-- Production-grade notification system for Mideeye
-- =====================================================

-- Create notification type enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'notification_type'
  ) THEN
    CREATE TYPE notification_type AS ENUM (
      'post_upvote',
      'comment_reply',
      'mention',
      'new_follower',
      'post_comment'
    );
  END IF;
END
$$;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  entity_id UUID,
  entity_type VARCHAR(50),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT different_user CHECK (user_id != actor_id),
  CONSTRAINT valid_entity CHECK (
    (entity_id IS NOT NULL AND entity_type IS NOT NULL) OR 
    (entity_id IS NULL AND entity_type IS NULL)
  )
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Primary query: Get user's unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON notifications(user_id, is_read, created_at DESC) 
  WHERE is_read = FALSE;

-- Query: Get all user notifications (paginated)
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
  ON notifications(user_id, created_at DESC);

-- Query: Get notifications by entity (for deduplication)
CREATE INDEX IF NOT EXISTS idx_notifications_entity 
  ON notifications(entity_id, entity_type, user_id);

-- Query: Get notifications by actor
CREATE INDEX IF NOT EXISTS idx_notifications_actor 
  ON notifications(actor_id, created_at DESC);

-- Composite index for efficient counting
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_count 
  ON notifications(user_id, is_read);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" 
  ON notifications FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can mark their own notifications as read
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" 
  ON notifications FOR UPDATE 
  USING (auth.uid() = user_id);

-- System can insert notifications for any user
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
CREATE POLICY "System can insert notifications" 
  ON notifications FOR INSERT 
  WITH CHECK (TRUE);

-- Users can delete their own notifications
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications" 
  ON notifications FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE notifications 
  SET is_read = TRUE, read_at = NOW()
  WHERE id = notification_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE notifications 
  SET is_read = TRUE, read_at = NOW()
  WHERE user_id = auth.uid() AND is_read = FALSE;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM notifications
    WHERE user_id = auth.uid() AND is_read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification (prevents duplicates)
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_actor_id UUID,
  p_type notification_type,
  p_entity_id UUID DEFAULT NULL,
  p_entity_type VARCHAR DEFAULT NULL,
  p_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
  v_existing_id UUID;
BEGIN
  -- Don't notify users about their own actions
  IF p_user_id = p_actor_id THEN
    RETURN NULL;
  END IF;

  -- Check for duplicate notification in last hour
  SELECT id INTO v_existing_id
  FROM notifications
  WHERE user_id = p_user_id
    AND actor_id = p_actor_id
    AND type = p_type
    AND entity_id = p_entity_id
    AND created_at > NOW() - INTERVAL '1 hour'
  LIMIT 1;

  -- If duplicate exists, return existing ID
  IF v_existing_id IS NOT NULL THEN
    RETURN v_existing_id;
  END IF;

  -- Create new notification
  INSERT INTO notifications (
    user_id, actor_id, type, entity_id, entity_type, message
  )
  VALUES (
    p_user_id, p_actor_id, p_type, p_entity_id, p_entity_type, p_message
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS FOR AUTO-NOTIFICATIONS
-- =====================================================

-- Trigger: Notify on new vote
CREATE OR REPLACE FUNCTION notify_on_vote()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify on upvotes
  IF NEW.value > 0 THEN
    PERFORM create_notification(
      (SELECT user_id FROM questions WHERE id = NEW.votable_id),
      NEW.user_id,
      'post_upvote',
      NEW.votable_id,
      NEW.votable_type,
      NULL
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_vote ON votes;
CREATE TRIGGER trigger_notify_vote
  AFTER INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_vote();

-- Trigger: Notify on new answer/comment
CREATE OR REPLACE FUNCTION notify_on_answer()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_notification(
    (SELECT user_id FROM questions WHERE id = NEW.question_id),
    NEW.user_id,
    'comment_reply',
    NEW.id,
    'answer',
    LEFT(NEW.content, 100)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_answer ON answers;
CREATE TRIGGER trigger_notify_answer
  AFTER INSERT ON answers
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_answer();

-- =====================================================
-- CLEANUP & MAINTENANCE
-- =====================================================

-- Function to cleanup old read notifications (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notifications
  WHERE is_read = TRUE 
    AND read_at < NOW() - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT USAGE ON TYPE notification_type TO authenticated;
GRANT ALL ON notifications TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_read(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_all_notifications_read() TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_notification_count() TO authenticated;
