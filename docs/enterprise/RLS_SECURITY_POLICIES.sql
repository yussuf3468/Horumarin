-- Enterprise-grade RLS policies (blueprint)

-- =====================================================
-- PROFILES
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_policy ON profiles;
CREATE POLICY profiles_select_policy
ON profiles FOR SELECT
USING (visibility = 'active' AND deleted_at IS NULL);

DROP POLICY IF EXISTS profiles_insert_policy ON profiles;
CREATE POLICY profiles_insert_policy
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS profiles_update_policy ON profiles;
CREATE POLICY profiles_update_policy
ON profiles FOR UPDATE
USING (auth.uid() = id OR EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('moderator', 'admin')
))
WITH CHECK (auth.uid() = id OR EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('moderator', 'admin')
));

-- =====================================================
-- POSTS (questions table)
-- =====================================================
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS questions_read_active_policy ON questions;
CREATE POLICY questions_read_active_policy
ON questions FOR SELECT
USING (
  deleted_at IS NULL
  AND (
    visibility = 'active'
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('moderator', 'admin'))
  )
);

DROP POLICY IF EXISTS questions_insert_policy ON questions;
CREATE POLICY questions_insert_policy
ON questions FOR INSERT
WITH CHECK (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS questions_update_owner_or_mod_policy ON questions;
CREATE POLICY questions_update_owner_or_mod_policy
ON questions FOR UPDATE
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('moderator', 'admin'))
)
WITH CHECK (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('moderator', 'admin'))
);

-- =====================================================
-- VOTES
-- =====================================================
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS votes_insert_policy ON votes;
CREATE POLICY votes_insert_policy
ON votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS votes_update_policy ON votes;
CREATE POLICY votes_update_policy
ON votes FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS votes_delete_policy ON votes;
CREATE POLICY votes_delete_policy
ON votes FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- MODERATION REPORTS
-- =====================================================
ALTER TABLE moderation_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY moderation_reports_insert_policy
ON moderation_reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY moderation_reports_read_own_or_mod_policy
ON moderation_reports FOR SELECT
USING (
  auth.uid() = reporter_id
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('moderator', 'admin'))
);

CREATE POLICY moderation_reports_update_mod_policy
ON moderation_reports FOR UPDATE
USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('moderator', 'admin')))
WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('moderator', 'admin')));
