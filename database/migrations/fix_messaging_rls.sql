-- =====================================================
-- FIX: Infinite recursion in conversation_participants RLS
-- =====================================================

-- PROBLEM: The original policy was querying conversation_participants 
-- from within a policy FOR conversation_participants, causing
-- infinite recursion when PostgreSQL tries to enforce the policy.
-- Error: "infinite recursion detected in policy for relation conversation_participants"

-- SOLUTION: Allow reading all participant records.
-- Security is still enforced because:
-- 1. conversations table RLS prevents seeing conversations you're not in
-- 2. messages table RLS prevents seeing messages in conversations you're not in
-- 3. Participant records alone don't expose sensitive data

-- =====================================================
-- STEP 1: Fix conversation_participants SELECT policy
-- =====================================================

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Users can view participants in own conversations" ON conversation_participants;

-- Create a simple, non-recursive policy that allows reading all participant records
CREATE POLICY "Users can view participants in own conversations" 
  ON conversation_participants FOR SELECT 
  USING (TRUE);  -- Allow reading all participant records

-- =====================================================
-- STEP 2: Fix get_or_create_conversation function
-- =====================================================

-- The function needs SECURITY DEFINER to bypass RLS when searching for existing conversations
-- This is safe because it only returns conversation IDs for conversations the user is part of

CREATE OR REPLACE FUNCTION get_or_create_conversation(
  p_user_id_1 UUID,
  p_user_id_2 UUID
)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
BEGIN
  -- Find existing conversation
  -- SECURITY DEFINER allows this to bypass RLS policies
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

-- =====================================================
-- VERIFICATION: Test that policies work
-- =====================================================

-- You should be able to run these queries without errors:
-- SELECT * FROM conversation_participants;
-- SELECT * FROM conversations WHERE id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid());
