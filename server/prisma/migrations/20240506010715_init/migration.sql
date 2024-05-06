/*
  Warnings:

  - Made the column `blockId` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `yearLevel` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_blockId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "blockId" SET NOT NULL,
ALTER COLUMN "yearLevel" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
