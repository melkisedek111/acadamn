/*
  Warnings:

  - The `options` column on the `ExamItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `answers` column on the `ExamItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ExamItem" DROP COLUMN "options",
ADD COLUMN     "options" TEXT[],
DROP COLUMN "answers",
ADD COLUMN     "answers" TEXT[];
