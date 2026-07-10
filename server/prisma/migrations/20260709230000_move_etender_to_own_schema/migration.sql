-- e-Tender models moved to their own isolated Postgres schema `etender`
-- (prisma/etender/schema.prisma). Drop the now-orphaned public copies; the
-- data is re-populated by the sync into the etender schema.
DROP TABLE IF EXISTS "public"."etender_sync_logs";
DROP TABLE IF EXISTS "public"."etender_lots";
DROP TYPE IF EXISTS "public"."EtenderSyncStatus";
