/*
  Warnings:

  - Changed the type of `status` on the `ExtractSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UNKNOWN', 'FAIL', 'SUCCESS');

-- Add a new column with the enum type
ALTER TABLE "ExtractSession" ADD COLUMN "status_new" "Status";

-- Update the new column with the values from the old column
UPDATE "ExtractSession" SET "status_new" = CASE
  WHEN "status" = 'unknown' THEN 'UNKNOWN'::"Status"
  WHEN "status" = 'fail' THEN 'FAIL'::"Status"
  WHEN "status" = 'success' THEN 'SUCCESS'::"Status"
END;

-- Drop the old column
ALTER TABLE "ExtractSession" DROP COLUMN "status";

-- Rename the new column to the old column's name
ALTER TABLE "ExtractSession" RENAME COLUMN "status_new" TO "status";

