-- =====================================================
-- FIX: notification_type enum + nullable entity_id
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add missing enum values
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'new_follower';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'post_upvote';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'comment_reply';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'post_comment';

-- 2. Make entity_id, entity_type, message nullable — follow notifications have no target entity or message
ALTER TABLE notifications ALTER COLUMN entity_id DROP NOT NULL;
ALTER TABLE notifications ALTER COLUMN entity_type DROP NOT NULL;
ALTER TABLE notifications ALTER COLUMN message DROP NOT NULL;
