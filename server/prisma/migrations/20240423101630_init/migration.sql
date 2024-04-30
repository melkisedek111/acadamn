/*
  Warnings:

  - You are about to drop the column `image` on the `ExamItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExamItem" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
