-- CreateTable
CREATE TABLE "telegram_threads" (
    "groupMessageId" INTEGER NOT NULL,
    "userChatId" TEXT NOT NULL,
    "userName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telegram_threads_pkey" PRIMARY KEY ("groupMessageId")
);

-- CreateIndex
CREATE INDEX "telegram_threads_userChatId_idx" ON "telegram_threads"("userChatId");
