/*
  # Make materials read-only to public clients

  The materials catalog is public reference data: any visitor may READ it, but
  nothing in the application ever writes to it. The original policies granted
  INSERT/UPDATE/DELETE to `anon` and `authenticated` with always-true
  predicates, which made the whole table writable and deletable by anyone
  holding the publishable anon key (shipped in every browser bundle).

  1. Policies removed
     - `anon_insert_materials`
     - `anon_update_materials`
     - `anon_delete_materials`

  2. Grants revoked
     - INSERT, UPDATE, DELETE on `public.materials` from `anon`, `authenticated`

  3. Preserved
     - RLS stays enabled
     - `anon_read_materials` (SELECT USING true) and the SELECT grant are kept,
       so public read access is unchanged.

  No data is modified or dropped.
*/

DROP POLICY IF EXISTS "anon_insert_materials" ON public.materials;
DROP POLICY IF EXISTS "anon_update_materials" ON public.materials;
DROP POLICY IF EXISTS "anon_delete_materials" ON public.materials;

REVOKE INSERT, UPDATE, DELETE ON public.materials FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.materials FROM authenticated;
