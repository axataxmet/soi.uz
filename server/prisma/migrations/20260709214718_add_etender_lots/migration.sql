-- CreateEnum
CREATE TYPE "EtenderSyncStatus" AS ENUM ('SUCCESS', 'PARTIAL', 'FAILED');

-- CreateTable
CREATE TABLE "etender_lots" (
    "id" TEXT NOT NULL,
    "externalId" INTEGER NOT NULL,
    "displayNo" TEXT,
    "typeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "clarificDate" TIMESTAMP(3),
    "cost" DECIMAL(24,2),
    "sellerId" INTEGER,
    "sellerName" TEXT,
    "sellerTin" TEXT,
    "regionName" TEXT,
    "districtName" TEXT,
    "categoryName" TEXT,
    "currencyId" INTEGER,
    "currencyName" TEXT,
    "currencyCode" TEXT,
    "raw" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "etender_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etender_sync_logs" (
    "id" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "status" "EtenderSyncStatus" NOT NULL,
    "fetched" INTEGER NOT NULL DEFAULT 0,
    "upserted" INTEGER NOT NULL DEFAULT 0,
    "deactivated" INTEGER NOT NULL DEFAULT 0,
    "totalCount" INTEGER,
    "durationMs" INTEGER,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "etender_sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "etender_lots_externalId_key" ON "etender_lots"("externalId");

-- CreateIndex
CREATE INDEX "etender_lots_typeId_active_idx" ON "etender_lots"("typeId", "active");

-- CreateIndex
CREATE INDEX "etender_lots_endDate_idx" ON "etender_lots"("endDate");

-- CreateIndex
CREATE INDEX "etender_sync_logs_typeId_startedAt_idx" ON "etender_sync_logs"("typeId", "startedAt");
