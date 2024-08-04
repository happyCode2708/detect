/*
  Warnings:

  - You are about to drop the column `result_all` on the `ExtractSession` table. All the data in the column will be lost.
  - You are about to drop the column `result_attr_1` on the `ExtractSession` table. All the data in the column will be lost.
  - You are about to drop the column `result_attr_2` on the `ExtractSession` table. All the data in the column will be lost.
  - You are about to drop the column `result_nut` on the `ExtractSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExtractSession" DROP COLUMN "result_all",
DROP COLUMN "result_attr_1",
DROP COLUMN "result_attr_2",
DROP COLUMN "result_nut";
