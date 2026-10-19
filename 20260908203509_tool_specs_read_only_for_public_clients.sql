/*
  # Make tool_specs read-only to public clients

  Tightening tool specifications are public reference data the application only
  reads. Anonymous INSERT/UPDATE/DELETE allowed wiping the table or changing
  socket sizes. Public read is intended; public write is not.

  1. Policies removed
     - `anon_insert_tool_specs`
     - `anon_update_tool_specs`
     - `anon_delete_tool_specs`

  2. Grants revoked
     - INSERT, UPDATE, DELETE on `public.tool_specs` from `anon`, `authenticated`

  3. Preserved
     - RLS stays enabled; the SELECT policy and SELECT grant are untouched.

  No data is modified or dropped.
*/

DROP POLICY IF EXISTS "anon_insert_tool_specs" ON public.tool_specs;
DROP POLICY IF EXISTS "anon_update_tool_specs" ON public.tool_specs;
DROP POLICY IF EXISTS "anon_delete_tool_specs" ON public.tool_specs;

REVOKE INSERT, UPDATE, DELETE ON public.tool_specs FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.tool_specs FROM authenticated;
