/*
  Warnings:

  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateOfBirth` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `barangay` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `municipality` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `province` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "dateOfBirth" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "barangay" SET NOT NULL,
ALTER COLUMN "municipality" SET NOT NULL,
ALTER COLUMN "province" SET NOT NULL;
