/*
  Warnings:

  - You are about to drop the column `studentIdentificatonId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `StudentIdentificaton` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `studentIdentificationId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_studentIdentificatonId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "studentIdentificatonId",
ADD COLUMN     "studentIdentificationId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "StudentIdentificaton";

-- CreateTable
CREATE TABLE "StudentIdentification" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentIdentification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentIdentification_studentId_key" ON "StudentIdentification"("studentId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_studentIdentificationId_fkey" FOREIGN KEY ("studentIdentificationId") REFERENCES "StudentIdentification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
