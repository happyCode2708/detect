/*
  Warnings:

  - You are about to drop the column `result` on the `ExtractSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExtractSession" DROP COLUMN "result",
ADD COLUMN     "result_all" TEXT,
ADD COLUMN     "result_nut" TEXT;
