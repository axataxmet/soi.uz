-- CreateTable
CREATE TABLE "telegram_contacts" (
    "chatId" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telegram_contacts_pkey" PRIMARY KEY ("chatId")
);
