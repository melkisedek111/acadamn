/*
  Warnings:

  - The `day` column on the `Subject` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "day",
ADD COLUMN     "day" TEXT[];
