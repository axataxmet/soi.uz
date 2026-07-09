/*
  Warnings:

  - You are about to drop the column `brandId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `docs` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `specs` on the `products` table. All the data in the column will be lost.
  - The `status` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cat_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cat_directions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cat_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cat_links` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cat_seccats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cat_sections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cat_subcategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'VIDEO', 'INSTRUCTION', 'CERTIFICATE', 'INFOGRAPHIC');

-- CreateEnum
CREATE TYPE "RegDocType" AS ENUM ('RU', 'CE', 'ISO', 'DECLARATION', 'CERTIFICATE');

-- CreateEnum
CREATE TYPE "RiskClass" AS ENUM ('CLASS_1', 'CLASS_2A', 'CLASS_2B', 'CLASS_3');

-- CreateEnum
CREATE TYPE "RegDocStatus" AS ENUM ('PRESENT', 'ON_REQUEST', 'IN_PROGRESS', 'NOT_REQUIRED', 'NO_DATA');

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_brandId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- DropIndex
DROP INDEX "products_brandId_idx";

-- DropIndex
DROP INDEX "products_categoryId_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "brandId",
DROP COLUMN "categoryId",
DROP COLUMN "currency",
DROP COLUMN "docs",
DROP COLUMN "images",
DROP COLUMN "price",
DROP COLUMN "specs",
ADD COLUMN     "attrs" JSONB,
ADD COLUMN     "gtin" TEXT,
ADD COLUMN     "manufacturerId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT';

-- DropTable
DROP TABLE "brands";

-- DropTable
DROP TABLE "cat_categories";

-- DropTable
DROP TABLE "cat_directions";

-- DropTable
DROP TABLE "cat_groups";

-- DropTable
DROP TABLE "cat_links";

-- DropTable
DROP TABLE "cat_seccats";

-- DropTable
DROP TABLE "cat_sections";

-- DropTable
DROP TABLE "cat_subcategories";

-- DropTable
DROP TABLE "categories";

-- CreateTable
CREATE TABLE "type_categories" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "type_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type_subcategories" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "productCount" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "type_subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spec_categories" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spec_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "productId" TEXT NOT NULL,
    "subcatId" TEXT NOT NULL,

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("productId","subcatId")
);

-- CreateTable
CREATE TABLE "product_specs" (
    "productId" TEXT NOT NULL,
    "specId" TEXT NOT NULL,

    CONSTRAINT "product_specs_pkey" PRIMARY KEY ("productId","specId")
);

-- CreateTable
CREATE TABLE "manufacturers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameI18n" JSONB,
    "legalName" TEXT,
    "country" TEXT,
    "inn" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "fixed" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manufacturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_media" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'PHOTO',
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_compatibility" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "consumableId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_compatibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_prices" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "price" DECIMAL(14,2),
    "oldPrice" DECIMAL(14,2),
    "wholesalePrice" DECIMAL(14,2),
    "priceOnRequest" BOOLEAN NOT NULL DEFAULT false,
    "priceWithVat" DECIMAL(14,2),
    "priceWithoutVat" DECIMAL(14,2),
    "currency" TEXT NOT NULL DEFAULT 'UZS',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_stocks" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "reservedQty" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reg_documents" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "RegDocType",
    "number" TEXT,
    "classRisk" "RiskClass",
    "issuedAt" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "issuer" TEXT,
    "fileUrl" TEXT,
    "status" "RegDocStatus" NOT NULL DEFAULT 'NO_DATA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reg_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "type_categories_slug_key" ON "type_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "type_subcategories_slug_key" ON "type_subcategories"("slug");

-- CreateIndex
CREATE INDEX "type_subcategories_categoryId_idx" ON "type_subcategories"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "spec_categories_slug_key" ON "spec_categories"("slug");

-- CreateIndex
CREATE INDEX "product_types_subcatId_idx" ON "product_types"("subcatId");

-- CreateIndex
CREATE INDEX "product_specs_specId_idx" ON "product_specs"("specId");

-- CreateIndex
CREATE INDEX "product_media_productId_idx" ON "product_media"("productId");

-- CreateIndex
CREATE INDEX "product_compatibility_consumableId_idx" ON "product_compatibility"("consumableId");

-- CreateIndex
CREATE UNIQUE INDEX "product_compatibility_equipmentId_consumableId_key" ON "product_compatibility"("equipmentId", "consumableId");

-- CreateIndex
CREATE INDEX "product_prices_productId_idx" ON "product_prices"("productId");

-- CreateIndex
CREATE INDEX "product_prices_sellerId_idx" ON "product_prices"("sellerId");

-- CreateIndex
CREATE INDEX "product_stocks_productId_idx" ON "product_stocks"("productId");

-- CreateIndex
CREATE INDEX "reg_documents_productId_idx" ON "reg_documents"("productId");

-- CreateIndex
CREATE INDEX "products_manufacturerId_idx" ON "products"("manufacturerId");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- AddForeignKey
ALTER TABLE "type_subcategories" ADD CONSTRAINT "type_subcategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "type_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_types" ADD CONSTRAINT "product_types_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_types" ADD CONSTRAINT "product_types_subcatId_fkey" FOREIGN KEY ("subcatId") REFERENCES "type_subcategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specs" ADD CONSTRAINT "product_specs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specs" ADD CONSTRAINT "product_specs_specId_fkey" FOREIGN KEY ("specId") REFERENCES "spec_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_compatibility" ADD CONSTRAINT "product_compatibility_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_compatibility" ADD CONSTRAINT "product_compatibility_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_stocks" ADD CONSTRAINT "product_stocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_stocks" ADD CONSTRAINT "product_stocks_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_stocks" ADD CONSTRAINT "product_stocks_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reg_documents" ADD CONSTRAINT "reg_documents_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
