/*
  Warnings:

  - Made the column `status` on table `ExtractSession` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ExtractSession" ALTER COLUMN "status" SET NOT NULL;
