-- AlterTable
ALTER TABLE "ExtractSession" ADD COLUMN     "attr_1_cost" DOUBLE PRECISION,
ADD COLUMN     "attr_2_cost" DOUBLE PRECISION,
ADD COLUMN     "nutrition_cost" TEXT;

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "name" TEXT;
