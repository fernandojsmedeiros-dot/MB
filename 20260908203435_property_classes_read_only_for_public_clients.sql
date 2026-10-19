/*
  # Make property_classes read-only to public clients

  `proof_stress_mpa`, `tensile_strength_mpa` and `yield_strength_mpa` are the
  strength constants bolt load capacities are computed from. Anonymous UPDATE
  allowed raising them, which produces unsafe rather than merely wrong results.
  Public read is intended; public write is not.

  1. Policies removed
     - `anon_insert_property_classes`
     - `anon_update_property_classes`
     - `anon_delete_property_classes`

  2. Grants revoked
     - INSERT, UPDATE, DELETE on `public.property_classes` from `anon`, `authenticated`

  3. Preserved
     - RLS stays enabled; the SELECT policy and SELECT grant are untouched.

  No data is modified or dropped.
*/

DROP POLICY IF EXISTS "anon_insert_property_classes" ON public.property_classes;
DROP POLICY IF EXISTS "anon_update_property_classes" ON public.property_classes;
DROP POLICY IF EXISTS "anon_delete_property_classes" ON public.property_classes;

REVOKE INSERT, UPDATE, DELETE ON public.property_classes FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.property_classes FROM authenticated;
