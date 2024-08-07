/*
  Warnings:

  - The `nutrition_cost` column on the `ExtractSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ExtractSession" DROP COLUMN "nutrition_cost",
ADD COLUMN     "nutrition_cost" DOUBLE PRECISION;
