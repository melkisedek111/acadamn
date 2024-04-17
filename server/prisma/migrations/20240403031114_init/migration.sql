/*
  Warnings:

  - Added the required column `isRegistered` to the `StudentIdentification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentIdentification" ADD COLUMN     "isRegistered" BOOLEAN NOT NULL;
