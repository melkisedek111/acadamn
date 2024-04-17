/*
  Warnings:

  - You are about to drop the column `Title` on the `Exam` table. All the data in the column will be lost.
  - Added the required column `title` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "Title",
ADD COLUMN     "title" TEXT NOT NULL;
