/*
  Warnings:

  - You are about to drop the column `createdAt` on the `CodePromo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idempotencyKey]` on the table `remboursements` will be added. If there are existing duplicate values, this will fail.
  - The required column `idempotencyKey` was added to the `remboursements` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "CodePromo" DROP COLUMN "createdAt",
ADD COLUMN     "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "remboursements" ADD COLUMN     "idempotencyKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "remboursements_idempotencyKey_key" ON "remboursements"("idempotencyKey");
