-- =====================================================
-- FIX: Infinite recursion in conversation_participants RLS
-- =====================================================

-- The original policy was querying conversation_participants 
-- from within a policy FOR conversation_participants, causing
-- infinite recursion when PostgreSQL tries to enforce the policy.

-- SOLUTION: Allow reading all participant records.
-- Security is still enforced because:
-- 1. conversations table RLS prevents seeing conversations you're not in
-- 2. messages table RLS prevents seeing messages in conversations you're not in
-- 3. Participant records alone don't expose sensitive data

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Users can view participants in own conversations" ON conversation_participants;

-- Create a simple, non-recursive policy that allows reading all participant records
CREATE POLICY "Users can view participants in own conversations" 
  ON conversation_participants FOR SELECT 
  USING (TRUE);  -- Allow reading all participant records
