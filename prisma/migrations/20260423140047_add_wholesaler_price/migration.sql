-- AlterTable: Add wholesalerPrice column to Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "wholesalerPrice" DOUBLE PRECISION;
