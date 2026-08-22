-- AlterTable
ALTER TABLE "telegram_contacts"
  ADD COLUMN "lang" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "step" TEXT NOT NULL DEFAULT 'done';
