/*
  Warnings:

  - A unique constraint covering the columns `[ixoneID]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ixoneID` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "ixoneID" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ExtractSession" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "folderPath" TEXT NOT NULL,

    CONSTRAINT "ExtractSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_ixoneID_key" ON "Product"("ixoneID");

-- AddForeignKey
ALTER TABLE "ExtractSession" ADD CONSTRAINT "ExtractSession_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
