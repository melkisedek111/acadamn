/*
  Warnings:

  - Made the column `blockId` on table `StudentIdentification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `yearLevel` on table `StudentIdentification` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "StudentIdentification" DROP CONSTRAINT "StudentIdentification_blockId_fkey";

-- AlterTable
ALTER TABLE "StudentIdentification" ALTER COLUMN "isRegistered" SET DEFAULT false,
ALTER COLUMN "blockId" SET NOT NULL,
ALTER COLUMN "yearLevel" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentIdentification" ADD CONSTRAINT "StudentIdentification_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
