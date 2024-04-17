/*
  Warnings:

  - A unique constraint covering the columns `[studentIdentificationId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_studentIdentificationId_key" ON "User"("studentIdentificationId");
