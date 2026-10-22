/*
  Warnings:

  - You are about to drop the column `prixUnitaireHt` on the `commande_formules` table. All the data in the column will be lost.
  - You are about to drop the column `prixHt` on the `formules` table. All the data in the column will be lost.
  - Added the required column `nomFige` to the `commande_empanadas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalHt` to the `commande_empanadas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTtc` to the `commande_empanadas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTva` to the `commande_empanadas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomFige` to the `commande_extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalHt` to the `commande_extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTtc` to the `commande_extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTva` to the `commande_extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomFige` to the `commande_formules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prixUnitaireTtc` to the `commande_formules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalHt` to the `commande_formules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTva` to the `commande_formules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prixTtc` to the `formules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "commande_empanadas" DROP CONSTRAINT "commande_empanadas_commandeFormuleId_fkey";

-- DropForeignKey
ALTER TABLE "commande_empanadas" DROP CONSTRAINT "commande_empanadas_commandeId_fkey";

-- DropForeignKey
ALTER TABLE "commande_extras" DROP CONSTRAINT "commande_extras_commandeFormuleId_fkey";

-- DropForeignKey
ALTER TABLE "commande_extras" DROP CONSTRAINT "commande_extras_commandeId_fkey";

-- DropForeignKey
ALTER TABLE "commande_formules" DROP CONSTRAINT "commande_formules_commandeId_fkey";

-- AlterTable
ALTER TABLE "commande_empanadas" ADD COLUMN     "nomFige" TEXT NOT NULL,
ADD COLUMN     "supplementTtc" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalHt" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalTtc" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalTva" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "commande_extras" ADD COLUMN     "nomFige" TEXT NOT NULL,
ADD COLUMN     "supplementTtc" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalHt" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalTtc" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalTva" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "commande_formules" DROP COLUMN "prixUnitaireHt",
ADD COLUMN     "nomFige" TEXT NOT NULL,
ADD COLUMN     "prixUnitaireTtc" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalHt" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalTva" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "empanadas" ADD COLUMN     "supplementFormuleTtc" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "extras" ADD COLUMN     "supplementFormuleTtc" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "formules" DROP COLUMN "prixHt",
ADD COLUMN     "prixTtc" DECIMAL(10,2) NOT NULL;

-- CreateIndex
CREATE INDEX "commande_empanadas_commandeId_idx" ON "commande_empanadas"("commandeId");

-- CreateIndex
CREATE INDEX "commande_empanadas_commandeFormuleId_idx" ON "commande_empanadas"("commandeFormuleId");

-- CreateIndex
CREATE INDEX "commande_extras_commandeId_idx" ON "commande_extras"("commandeId");

-- CreateIndex
CREATE INDEX "commande_extras_commandeFormuleId_idx" ON "commande_extras"("commandeFormuleId");

-- CreateIndex
CREATE INDEX "commande_formules_commandeId_idx" ON "commande_formules"("commandeId");

-- CreateIndex
CREATE INDEX "extras_actif_idx" ON "extras"("actif");

-- CreateIndex
CREATE INDEX "formules_actif_idx" ON "formules"("actif");

-- AddForeignKey
ALTER TABLE "commande_formules" ADD CONSTRAINT "commande_formules_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "commandes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_empanadas" ADD CONSTRAINT "commande_empanadas_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "commandes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_empanadas" ADD CONSTRAINT "commande_empanadas_commandeFormuleId_fkey" FOREIGN KEY ("commandeFormuleId") REFERENCES "commande_formules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_extras" ADD CONSTRAINT "commande_extras_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "commandes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_extras" ADD CONSTRAINT "commande_extras_commandeFormuleId_fkey" FOREIGN KEY ("commandeFormuleId") REFERENCES "commande_formules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
