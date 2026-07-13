ALTER TABLE "etender_lots" ADD COLUMN "medCategory" TEXT;
CREATE INDEX "etender_lots_medCategory_active_idx" ON "etender_lots"("medCategory", "active");
