/*
  Warnings:

  - You are about to drop the column `productCount` on the `type_subcategories` table. All the data in the column will be lost.
  - You are about to drop the column `visible` on the `type_subcategories` table. All the data in the column will be lost.
  - You are about to drop the `product_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_types" DROP CONSTRAINT "product_types_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_types" DROP CONSTRAINT "product_types_subcatId_fkey";

-- AlterTable
ALTER TABLE "type_categories" ADD COLUMN     "attrSchema" JSONB;

-- AlterTable
ALTER TABLE "type_subcategories" DROP COLUMN "productCount",
DROP COLUMN "visible",
ADD COLUMN     "attrSchema" JSONB;

-- DropTable
DROP TABLE "product_types";

-- CreateTable
CREATE TABLE "product_groups" (
    "id" TEXT NOT NULL,
    "subcatId" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "attrSchema" JSONB,
    "productCount" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_group_items" (
    "productId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "product_group_items_pkey" PRIMARY KEY ("productId","groupId")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_groups_slug_key" ON "product_groups"("slug");

-- CreateIndex
CREATE INDEX "product_groups_subcatId_idx" ON "product_groups"("subcatId");

-- CreateIndex
CREATE INDEX "product_group_items_groupId_idx" ON "product_group_items"("groupId");

-- AddForeignKey
ALTER TABLE "product_groups" ADD CONSTRAINT "product_groups_subcatId_fkey" FOREIGN KEY ("subcatId") REFERENCES "type_subcategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_group_items" ADD CONSTRAINT "product_group_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_group_items" ADD CONSTRAINT "product_group_items_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "product_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
