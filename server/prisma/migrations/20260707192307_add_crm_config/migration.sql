-- CreateTable
CREATE TABLE "crm_config" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "mode" TEXT NOT NULL DEFAULT 'proxy',
    "proxyUrl" TEXT,
    "subdomain" TEXT,
    "token" TEXT,
    "pipelineId" TEXT,
    "statusId" TEXT,
    "responsibleUserId" TEXT,
    "telegramToken" TEXT,
    "telegramChatId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_config_pkey" PRIMARY KEY ("id")
);
