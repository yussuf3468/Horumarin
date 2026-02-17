-- =====================================================
-- REAL-TIME MESSAGING SYSTEM
-- Production-grade 1-on-1 chat for Mideeye
-- =====================================================

-- =====================================================
-- CONVERSATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_preview TEXT,
  
  -- Metadata
  is_archived BOOLEAN DEFAULT FALSE
);

-- =====================================================
-- CONVERSATION PARTICIPANTS
-- =====================================================

CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  is_muted BOOLEAN DEFAULT FALSE,
  
  -- Ensure unique user per conversation
  CONSTRAINT unique_participant UNIQUE(conversation_id, user_id)
);

-- =====================================================
-- MESSAGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  
  -- Read receipts
  read_by UUID[] DEFAULT ARRAY[]::UUID[],
  
  -- Constraints
  CONSTRAINT content_not_empty CHECK (LENGTH(TRIM(content)) > 0 OR is_deleted = TRUE)
);

-- =====================================================
-- TYPING INDICATORS TABLE (ephemeral)
-- =====================================================

CREATE TABLE IF NOT EXISTS typing_indicators (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Auto-expire after 3 seconds
  PRIMARY KEY (conversation_id, user_id)
);

-- =====================================================
-- USER PRESENCE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_presence (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'away', 'offline')),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Conversations indexes
CREATE INDEX idx_conversations_updated 
  ON conversations(updated_at DESC);

CREATE INDEX idx_conversations_last_message 
  ON conversations(last_message_at DESC);

-- Participants indexes
CREATE INDEX idx_participants_user 
  ON conversation_participants(user_id, last_read_at DESC);

CREATE INDEX idx_participants_conversation 
  ON conversation_participants(conversation_id);

-- Messages indexes  
CREATE INDEX idx_messages_conversation_created 
  ON messages(conversation_id, created_at DESC);

CREATE INDEX idx_messages_sender 
  ON messages(sender_id, created_at DESC);

CREATE INDEX idx_messages_unread 
  ON messages(conversation_id, created_at) 
  WHERE is_deleted = FALSE;

-- Typing indicators index
CREATE INDEX idx_typing_conversation 
  ON typing_indicators(conversation_id, started_at);

-- Presence index
CREATE INDEX idx_presence_status 
  ON user_presence(status, last_seen_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Conversations RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" 
  ON conversations FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own conversations" 
  ON conversations FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = id AND user_id = auth.uid()
    )
  );

-- Participants RLS
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants in own conversations" 
  ON conversation_participants FOR SELECT 
  USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own participant record" 
  ON conversation_participants FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "System can insert participants" 
  ON conversation_participants FOR INSERT 
  WITH CHECK (TRUE);

-- Messages RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own conversations" 
  ON messages FOR SELECT 
  USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own conversations" 
  ON messages FOR INSERT 
  WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own messages" 
  ON messages FOR UPDATE 
  USING (sender_id = auth.uid());

-- Typing indicators RLS
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view typing in own conversations" 
  ON typing_indicators FOR SELECT 
  USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own typing status" 
  ON typing_indicators FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own typing status" 
  ON typing_indicators FOR DELETE 
  USING (user_id = auth.uid());

-- Presence RLS
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view presence" 
  ON user_presence FOR SELECT 
  USING (TRUE);

CREATE POLICY "Users can update own presence" 
  ON user_presence FOR INSERT 
  WITH CHECK (user_id = auth.uid())
  ON CONFLICT (user_id) DO UPDATE 
  SET status = EXCLUDED.status, 
      last_seen_at = EXCLUDED.last_seen_at,
      updated_at = NOW();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get or create conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(
  p_user_id_1 UUID,
  p_user_id_2 UUID
)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
BEGIN
  -- Find existing conversation
  SELECT cp1.conversation_id INTO v_conversation_id
  FROM conversation_participants cp1
  INNER JOIN conversation_participants cp2 
    ON cp1.conversation_id = cp2.conversation_id
  WHERE cp1.user_id = p_user_id_1 
    AND cp2.user_id = p_user_id_2
  LIMIT 1;

  -- Create new conversation if none exists
  IF v_conversation_id IS NULL THEN
    INSERT INTO conversations DEFAULT VALUES
    RETURNING id INTO v_conversation_id;

    -- Add both participants
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES 
      (v_conversation_id, p_user_id_1),
      (v_conversation_id, p_user_id_2);
  END IF;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get unread message count for user
CREATE OR REPLACE FUNCTION get_unread_message_count()
RETURNS TABLE(conversation_id UUID, unread_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.conversation_id,
    COUNT(*)::BIGINT as unread_count
  FROM messages m
  INNER JOIN conversation_participants cp 
    ON m.conversation_id = cp.conversation_id
  WHERE cp.user_id = auth.uid()
    AND m.sender_id != auth.uid()
    AND m.created_at > cp.last_read_at
    AND m.is_deleted = FALSE
  GROUP BY m.conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mark conversation as read
CREATE OR REPLACE FUNCTION mark_conversation_read(p_conversation_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE conversation_participants
  SET last_read_at = NOW()
  WHERE conversation_id = p_conversation_id 
    AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Send message
CREATE OR REPLACE FUNCTION send_message(
  p_conversation_id UUID,
  p_content TEXT
)
RETURNS UUID AS $$
DECLARE
  v_message_id UUID;
BEGIN
  -- Insert message
  INSERT INTO messages (conversation_id, sender_id, content)
  VALUES (p_conversation_id, auth.uid(), p_content)
  RETURNING id INTO v_message_id;

  -- Update conversation
  UPDATE conversations
  SET 
    updated_at = NOW(),
    last_message_at = NOW(),
    last_message_preview = LEFT(p_content, 100)
  WHERE id = p_conversation_id;

  RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Edit message
CREATE OR REPLACE FUNCTION edit_message(
  p_message_id UUID,
  p_new_content TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE messages
  SET 
    content = p_new_content,
    edited_at = NOW()
  WHERE id = p_message_id 
    AND sender_id = auth.uid()
    AND is_deleted = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Delete message (soft delete)
CREATE OR REPLACE FUNCTION delete_message(p_message_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE messages
  SET 
    is_deleted = TRUE,
    deleted_at = NOW(),
    content = '[Message deleted]'
  WHERE id = p_message_id 
    AND sender_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user presence
CREATE OR REPLACE FUNCTION update_presence(p_status VARCHAR)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_presence (user_id, status, last_seen_at, updated_at)
  VALUES (auth.uid(), p_status, NOW(), NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    status = EXCLUDED.status,
    last_seen_at = EXCLUDED.last_seen_at,
    updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set typing indicator
CREATE OR REPLACE FUNCTION set_typing(p_conversation_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO typing_indicators (conversation_id, user_id, started_at)
  VALUES (p_conversation_id, auth.uid(), NOW())
  ON CONFLICT (conversation_id, user_id)
  DO UPDATE SET started_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clear typing indicator
CREATE OR REPLACE FUNCTION clear_typing(p_conversation_id UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM typing_indicators
  WHERE conversation_id = p_conversation_id 
    AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-cleanup old typing indicators
CREATE OR REPLACE FUNCTION cleanup_old_typing()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM typing_indicators
  WHERE started_at < NOW() - INTERVAL '5 seconds';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_typing
  AFTER INSERT ON typing_indicators
  EXECUTE FUNCTION cleanup_old_typing();

-- Update conversation timestamp on new message
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    updated_at = NEW.created_at,
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 100)
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- Grant permissions
GRANT ALL ON conversations TO authenticated;
GRANT ALL ON conversation_participants TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT ALL ON typing_indicators TO authenticated;
GRANT ALL ON user_presence TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_conversation TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_message_count TO authenticated;
GRANT EXECUTE ON FUNCTION mark_conversation_read TO authenticated;
GRANT EXECUTE ON FUNCTION send_message TO authenticated;
GRANT EXECUTE ON FUNCTION edit_message TO authenticated;
GRANT EXECUTE ON FUNCTION delete_message TO authenticated;
GRANT EXECUTE ON FUNCTION update_presence TO authenticated;
GRANT EXECUTE ON FUNCTION set_typing TO authenticated;
GRANT EXECUTE ON FUNCTION clear_typing TO authenticated;
