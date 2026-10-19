/*
  # Make material_categories read-only to public clients

  This table is the parent of `materials` via
  `materials.category_id ... ON DELETE CASCADE`, so an anonymous DELETE here
  cascaded into bulk deletion of material rows. Public read access is intended;
  public write access is not, and the application never writes to it.

  1. Policies removed
     - `anon_insert_material_categories`
     - `anon_update_material_categories`
     - `anon_delete_material_categories`

  2. Grants revoked
     - INSERT, UPDATE, DELETE on `public.material_categories` from `anon`, `authenticated`

  3. Preserved
     - RLS stays enabled; the SELECT policy and SELECT grant are untouched.

  No data is modified or dropped.
*/

DROP POLICY IF EXISTS "anon_insert_material_categories" ON public.material_categories;
DROP POLICY IF EXISTS "anon_update_material_categories" ON public.material_categories;
DROP POLICY IF EXISTS "anon_delete_material_categories" ON public.material_categories;

REVOKE INSERT, UPDATE, DELETE ON public.material_categories FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.material_categories FROM authenticated;
