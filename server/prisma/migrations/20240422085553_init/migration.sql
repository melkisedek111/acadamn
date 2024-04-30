/*
  Warnings:

  - Added the required column `hasCode` to the `ExamItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamItem" ADD COLUMN     "code" TEXT,
ADD COLUMN     "codeLanguage" TEXT,
ADD COLUMN     "hasCode" BOOLEAN NOT NULL,
ADD COLUMN     "itemCodeId" TEXT;
