/*
  # Make screw_sizes read-only to public clients

  `tensile_stress_area_mm2` on this table is the input the tensile, shear and
  clamp load figures are derived from. Anonymous UPDATE therefore allowed silent
  falsification of safety-relevant engineering values. Public read is intended;
  public write is not.

  1. Policies removed
     - `anon_insert_screw_sizes`
     - `anon_update_screw_sizes`
     - `anon_delete_screw_sizes`

  2. Grants revoked
     - INSERT, UPDATE, DELETE on `public.screw_sizes` from `anon`, `authenticated`

  3. Preserved
     - RLS stays enabled; the SELECT policy and SELECT grant are untouched.

  No data is modified or dropped.
*/

DROP POLICY IF EXISTS "anon_insert_screw_sizes" ON public.screw_sizes;
DROP POLICY IF EXISTS "anon_update_screw_sizes" ON public.screw_sizes;
DROP POLICY IF EXISTS "anon_delete_screw_sizes" ON public.screw_sizes;

REVOKE INSERT, UPDATE, DELETE ON public.screw_sizes FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.screw_sizes FROM authenticated;
