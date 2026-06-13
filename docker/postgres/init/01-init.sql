-- wiki12 Postgres init.
--
-- The A12 Data Service auto-provisions its own schema via Liquibase on startup
-- (findings §6, "External Postgres Database" / "Database Migration"), so there
-- are no tables to create here. POSTGRES_DB already creates the `wiki12`
-- database. This file exists as the documented hook for any future
-- bootstrap DDL (e.g. an optional partial unique index backstop on slugs,
-- ADR-0001 last resort — deliberately NOT added: slug uniqueness is the
-- advisory-lock path only, per the review-gate decision).

DO $$ BEGIN
  RAISE NOTICE 'wiki12: Postgres ready; A12 Data Service will run Liquibase on connect.';
END $$;
