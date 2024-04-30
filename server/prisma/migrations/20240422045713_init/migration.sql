/*
  Warnings:

  - You are about to drop the column `exmId` on the `UserExam` table. All the data in the column will be lost.
  - Added the required column `examId` to the `UserExam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `UserExam` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserExam" DROP CONSTRAINT "UserExam_exmId_fkey";

-- AlterTable
ALTER TABLE "UserExam" DROP COLUMN "exmId",
ADD COLUMN     "examId" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ExamItem" (
    "id" SERIAL NOT NULL,
    "itemType" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "optionType" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "answers" JSONB NOT NULL,
    "examId" INTEGER NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserExamAnswerItem" (
    "id" SERIAL NOT NULL,
    "answers" JSONB NOT NULL,
    "examItemId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserExamAnswerItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserExam" ADD CONSTRAINT "UserExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamItem" ADD CONSTRAINT "ExamItem_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExamAnswerItem" ADD CONSTRAINT "UserExamAnswerItem_examItemId_fkey" FOREIGN KEY ("examItemId") REFERENCES "ExamItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExamAnswerItem" ADD CONSTRAINT "UserExamAnswerItem_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
