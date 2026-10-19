/*
# Create materials database schema

## Overview
This migration creates the core database schema for the MechLab materials catalog.
It mirrors the structure of the existing CSV-based data, allowing materials to be
stored, queried, and managed in Supabase instead of static CSV files.

## New Tables

### 1. `material_categories`
Stores the category definitions (e.g., steels, aluminum, plastics, torque-preload, tools).
- `id` (text, primary key) — e.g. 'steels', 'torque-preload'
- `module` (text, not null) — which app section it belongs to: 'materials', 'mechanical-standards', 'standardized', 'fasteners', 'surface-treatment', 'gdnt'
- `label` (text, not null) — display name
- `description` (text) — short description
- `icon` (text) — lucide icon name
- `name_column` (text) — CSV column used as the commercial name
- `sort_order` (int, default 0) — ordering within a module

### 2. `materials`
Stores individual material records, each linked to a category.
- `id` (uuid, primary key)
- `category_id` (text, foreign key → material_categories.id)
- `commercial_name` (text, not null) — display name
- `primary_standard` (text) — e.g. SAE/AISI designation
- `secondary_standard` (text) — e.g. DIN/EN designation
- `data` (jsonb, not null) — all raw key/value columns from the CSV, stored as a flexible JSON object
- `created_at` (timestamptz)

### 3. `screw_sizes`
Stores the screw thread size reference data for the Screws and Tensile & Shear tabs.
- `id` (text, primary key) — e.g. 'M6', 'M8x1', '1/4-20'
- `label` (text, not null) — display label
- `system` (text, not null) — 'metric' or 'inch'
- `pitch` (text) — pitch description
- `pitch_mm` (numeric) — pitch in mm
- `minor_diameter_mm` (numeric) — minor diameter
- `tensile_stress_area_mm2` (numeric) — tensile stress area
- `clearance_hole_mm` (text) — clearance hole spec
- `tap_drill_mm` (text) — tap drill spec
- `sort_order` (int, default 0)

### 4. `property_classes`
Stores property class reference data (8.8, 10.9, 12.9, Grade 5, Grade 8).
- `id` (text, primary key) — e.g. '8.8', '10.9', 'Grade 5'
- `label` (text, not null) — display label
- `proof_stress_mpa` (numeric) — proof stress in MPa
- `tensile_strength_mpa` (numeric) — tensile strength in MPa
- `yield_strength_mpa` (numeric) — yield strength in MPa

### 5. `screw_class_links`
Junction table: which property classes are available for each screw size.
- `screw_id` (text, foreign key → screw_sizes.id)
- `class_id` (text, foreign key → property_classes.id)
- Primary key: (screw_id, class_id)

### 6. `tool_specs`
Stores tightening tool specifications per thread size (from Tools.csv).
- `id` (uuid, primary key)
- `material_ou_bitola` (text, not null) — thread designation
- `sistema` (text) — 'Metrico' or 'Imperial'
- `chave_soquete_mm` (text) — hex socket size
- `chave_boca_mm` (text) — open-end spanner size
- `chave_allen_mm` (text) — Allen key size
- `chave_torx` (text) — Torx size
- `clearence_soquete_ext_mm` (text) — socket outer clearance diameter
- `sort_order` (int, default 0)

## Security
This is a single-tenant application with no sign-in screen. All tables use
`TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)` because the
data is intentionally public/shared reference data — not user-owned.
RLS is enabled on every table as required.
*/

-- ============================================================
-- material_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS material_categories (
  id text PRIMARY KEY,
  module text NOT NULL,
  label text NOT NULL,
  description text,
  icon text,
  name_column text,
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE material_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_material_categories" ON material_categories;
CREATE POLICY "anon_select_material_categories" ON material_categories
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_material_categories" ON material_categories;
CREATE POLICY "anon_insert_material_categories" ON material_categories
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_material_categories" ON material_categories;
CREATE POLICY "anon_update_material_categories" ON material_categories
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_material_categories" ON material_categories;
CREATE POLICY "anon_delete_material_categories" ON material_categories
  FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- materials
-- ============================================================
CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id text NOT NULL REFERENCES material_categories(id) ON DELETE CASCADE,
  commercial_name text NOT NULL,
  primary_standard text DEFAULT '-',
  secondary_standard text DEFAULT '-',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_materials" ON materials;
CREATE POLICY "anon_select_materials" ON materials
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_materials" ON materials;
CREATE POLICY "anon_insert_materials" ON materials
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_materials" ON materials;
CREATE POLICY "anon_update_materials" ON materials
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_materials" ON materials;
CREATE POLICY "anon_delete_materials" ON materials
  FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_materials_category_id ON materials(category_id);
CREATE INDEX IF NOT EXISTS idx_materials_commercial_name ON materials(commercial_name);

-- ============================================================
-- screw_sizes
-- ============================================================
CREATE TABLE IF NOT EXISTS screw_sizes (
  id text PRIMARY KEY,
  label text NOT NULL,
  system text NOT NULL CHECK (system IN ('metric', 'inch')),
  pitch text,
  pitch_mm numeric,
  minor_diameter_mm numeric,
  tensile_stress_area_mm2 numeric,
  clearance_hole_mm text,
  tap_drill_mm text,
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE screw_sizes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_screw_sizes" ON screw_sizes;
CREATE POLICY "anon_select_screw_sizes" ON screw_sizes
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_screw_sizes" ON screw_sizes;
CREATE POLICY "anon_insert_screw_sizes" ON screw_sizes
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_screw_sizes" ON screw_sizes;
CREATE POLICY "anon_update_screw_sizes" ON screw_sizes
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_screw_sizes" ON screw_sizes;
CREATE POLICY "anon_delete_screw_sizes" ON screw_sizes
  FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- property_classes
-- ============================================================
CREATE TABLE IF NOT EXISTS property_classes (
  id text PRIMARY KEY,
  label text NOT NULL,
  proof_stress_mpa numeric,
  tensile_strength_mpa numeric,
  yield_strength_mpa numeric
);

ALTER TABLE property_classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_property_classes" ON property_classes;
CREATE POLICY "anon_select_property_classes" ON property_classes
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_property_classes" ON property_classes;
CREATE POLICY "anon_insert_property_classes" ON property_classes
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_property_classes" ON property_classes;
CREATE POLICY "anon_update_property_classes" ON property_classes
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_property_classes" ON property_classes;
CREATE POLICY "anon_delete_property_classes" ON property_classes
  FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- screw_class_links
-- ============================================================
CREATE TABLE IF NOT EXISTS screw_class_links (
  screw_id text NOT NULL REFERENCES screw_sizes(id) ON DELETE CASCADE,
  class_id text NOT NULL REFERENCES property_classes(id) ON DELETE CASCADE,
  PRIMARY KEY (screw_id, class_id)
);

ALTER TABLE screw_class_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_screw_class_links" ON screw_class_links;
CREATE POLICY "anon_select_screw_class_links" ON screw_class_links
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_screw_class_links" ON screw_class_links;
CREATE POLICY "anon_insert_screw_class_links" ON screw_class_links
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_screw_class_links" ON screw_class_links;
CREATE POLICY "anon_update_screw_class_links" ON screw_class_links
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_screw_class_links" ON screw_class_links;
CREATE POLICY "anon_delete_screw_class_links" ON screw_class_links
  FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- tool_specs
-- ============================================================
CREATE TABLE IF NOT EXISTS tool_specs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_ou_bitola text NOT NULL,
  sistema text,
  chave_soquete_mm text,
  chave_boca_mm text,
  chave_allen_mm text,
  chave_torx text,
  clearence_soquete_ext_mm text,
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE tool_specs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tool_specs" ON tool_specs;
CREATE POLICY "anon_select_tool_specs" ON tool_specs
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tool_specs" ON tool_specs;
CREATE POLICY "anon_insert_tool_specs" ON tool_specs
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tool_specs" ON tool_specs;
CREATE POLICY "anon_update_tool_specs" ON tool_specs
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tool_specs" ON tool_specs;
CREATE POLICY "anon_delete_tool_specs" ON tool_specs
  FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_tool_specs_material ON tool_specs(material_ou_bitola);
