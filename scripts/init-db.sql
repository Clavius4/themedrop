-- ── PostgreSQL bootstrap for ThemeDrop self-hosted ─────────────
-- Runs once on first container start (docker-entrypoint-initdb.d)

-- PostgREST requires these roles to exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
  END IF;
END $$;

GRANT anon, authenticated, service_role TO postgres;

-- Allow PostgREST to switch roles
ALTER ROLE postgres SET search_path TO public;

-- Grant usage so anon/auth can read public tables
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL   ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES   IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES   IN SCHEMA public TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL    ON TABLES TO service_role;
