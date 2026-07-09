-- CreateTable
CREATE TABLE "letters" (
    "id" TEXT NOT NULL,
    "type" "ReviewType" NOT NULL DEFAULT 'BUYER',
    "company" JSONB NOT NULL,
    "region" JSONB,
    "supplied" JSONB,
    "quote" JSONB,
    "body" JSONB,
    "letterUrl" TEXT,
    "color" TEXT,
    "date" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "letters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "letters_type_idx" ON "letters"("type");

-- CreateIndex
CREATE INDEX "letters_status_idx" ON "letters"("status");
