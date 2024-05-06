/*
  Warnings:

  - You are about to drop the column `blockId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `yearLevel` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_blockId_fkey";

-- AlterTable
ALTER TABLE "StudentIdentification" ADD COLUMN     "blockId" INTEGER,
ADD COLUMN     "yearLevel" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "blockId",
DROP COLUMN "yearLevel";

-- AddForeignKey
ALTER TABLE "StudentIdentification" ADD CONSTRAINT "StudentIdentification_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;
