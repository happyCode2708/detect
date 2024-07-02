/*
  Warnings:

  - The primary key for the `ExtractSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ExtractSession` table. All the data in the column will be lost.
  - The required column `sessionId` was added to the `ExtractSession` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "ExtractSession" DROP CONSTRAINT "ExtractSession_pkey",
DROP COLUMN "id",
ADD COLUMN     "sessionId" TEXT NOT NULL,
ADD CONSTRAINT "ExtractSession_pkey" PRIMARY KEY ("sessionId");
