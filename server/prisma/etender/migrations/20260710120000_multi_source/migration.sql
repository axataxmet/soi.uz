-- Multi-source refactor. Tender data is re-synced on the next run, so we truncate
-- rather than migrate rows (externalId changes Int -> Text).
TRUNCATE TABLE "etender_lots";
TRUNCATE TABLE "etender_sync_logs";

-- etender_lots
DROP INDEX IF EXISTS "etender_lots_externalId_key";
DROP INDEX IF EXISTS "etender_lots_typeId_active_idx";
ALTER TABLE "etender_lots"
  ALTER COLUMN "externalId" TYPE TEXT USING "externalId"::text,
  ALTER COLUMN "typeId" DROP NOT NULL,
  ADD COLUMN "source" TEXT NOT NULL,
  ADD COLUMN "kind" TEXT NOT NULL DEFAULT 'lot',
  ADD COLUMN "sourceUrl" TEXT;
CREATE UNIQUE INDEX "etender_lots_source_externalId_key" ON "etender_lots"("source", "externalId");
CREATE INDEX "etender_lots_source_active_idx" ON "etender_lots"("source", "active");
CREATE INDEX "etender_lots_kind_active_idx" ON "etender_lots"("kind", "active");

-- etender_sync_logs
DROP INDEX IF EXISTS "etender_sync_logs_typeId_startedAt_idx";
ALTER TABLE "etender_sync_logs"
  ALTER COLUMN "typeId" DROP NOT NULL,
  ADD COLUMN "source" TEXT NOT NULL;
CREATE INDEX "etender_sync_logs_source_startedAt_idx" ON "etender_sync_logs"("source", "startedAt");
