/*
  # Make screw_class_links read-only to public clients

  This junction table decides which property classes are offered for a given
  fastener. An always-true INSERT check let anyone assert relationships the
  reference standards do not contain, and DELETE let anyone remove valid ones.
  Public read is intended; public write is not.

  1. Policies removed
     - `anon_insert_screw_class_links`
     - `anon_update_screw_class_links`
     - `anon_delete_screw_class_links`

  2. Grants revoked
     - INSERT, UPDATE, DELETE on `public.screw_class_links` from `anon`, `authenticated`

  3. Preserved
     - RLS stays enabled; the SELECT policy and SELECT grant are untouched.

  No data is modified or dropped.
*/

DROP POLICY IF EXISTS "anon_insert_screw_class_links" ON public.screw_class_links;
DROP POLICY IF EXISTS "anon_update_screw_class_links" ON public.screw_class_links;
DROP POLICY IF EXISTS "anon_delete_screw_class_links" ON public.screw_class_links;

REVOKE INSERT, UPDATE, DELETE ON public.screw_class_links FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.screw_class_links FROM authenticated;
