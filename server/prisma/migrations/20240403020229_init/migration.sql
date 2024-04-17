/*
  Warnings:

  - You are about to drop the column `studentId` on the `User` table. All the data in the column will be lost.
  - Added the required column `studentIdentificatonId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_studentId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "studentId",
ADD COLUMN     "studentIdentificatonId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "StudentIdentificaton" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentIdentificaton_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentIdentificaton_studentId_key" ON "StudentIdentificaton"("studentId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_studentIdentificatonId_fkey" FOREIGN KEY ("studentIdentificatonId") REFERENCES "StudentIdentificaton"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
