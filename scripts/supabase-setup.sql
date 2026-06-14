-- ThemeDrop Supabase setup
-- Run this in the Supabase SQL Editor at https://supabase.com/dashboard

-- 1. THEMES TABLE
CREATE TABLE IF NOT EXISTS themes (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT        UNIQUE NOT NULL,
  name          TEXT        NOT NULL,
  description   TEXT        NOT NULL DEFAULT '',
  long_description TEXT     NOT NULL DEFAULT '',
  category      TEXT        NOT NULL DEFAULT 'minimal',
  tags          TEXT[]      NOT NULL DEFAULT '{}',
  wallpaper_count INT       NOT NULL DEFAULT 10,
  color         TEXT        NOT NULL DEFAULT '#C8A030',
  featured      BOOLEAN     NOT NULL DEFAULT false,
  release_date  TEXT        NOT NULL DEFAULT CURRENT_DATE::TEXT,
  total_downloads INT       NOT NULL DEFAULT 0,
  rating        NUMERIC(3,1) NOT NULL DEFAULT 5.0,
  rating_count  INT         NOT NULL DEFAULT 0,
  previews      TEXT[]      NOT NULL DEFAULT '{}',
  downloads     JSONB       NOT NULL DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS themes_updated_at ON themes;
CREATE TRIGGER themes_updated_at
  BEFORE UPDATE ON themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. ROW LEVEL SECURITY
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Public can read all themes
CREATE POLICY "Public read themes"
  ON themes FOR SELECT TO anon, authenticated USING (true);

-- Only service role can write (we use the service key server-side)
-- No insert/update/delete policies needed for anon — service role bypasses RLS

-- 3. STORAGE BUCKETS
-- Run these separately via the Supabase Storage UI or use the API:
--
-- Bucket: "previews"  → Public read, service-role write
-- Bucket: "downloads" → Public read, service-role write
--
-- In the Supabase Dashboard → Storage → New Bucket:
--   Name: previews   | Public: ON
--   Name: downloads  | Public: ON

-- 4. STORAGE POLICIES (run after creating buckets)
INSERT INTO storage.buckets (id, name, public) VALUES ('previews', 'previews', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('downloads', 'downloads', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public read previews"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'previews');

CREATE POLICY "Service upload previews"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'previews');

CREATE POLICY "Public read downloads"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'downloads');

CREATE POLICY "Service upload downloads"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'downloads');
