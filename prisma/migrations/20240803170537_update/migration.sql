/*
  Warnings:

  - You are about to drop the column `orc` on the `ExtractSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExtractSession" DROP COLUMN "orc",
ADD COLUMN     "ocr" TEXT;
