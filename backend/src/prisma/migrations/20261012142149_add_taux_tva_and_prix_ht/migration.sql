/*
  Warnings:

  - You are about to drop the column `prixUnitaire` on the `commande_empanadas` table. All the data in the column will be lost.
  - You are about to drop the column `prixUnitaire` on the `commande_extras` table. All the data in the column will be lost.
  - You are about to drop the column `prixUnitaire` on the `commande_formules` table. All the data in the column will be lost.
  - You are about to drop the column `prix` on the `empanadas` table. All the data in the column will be lost.
  - You are about to drop the column `prix` on the `extras` table. All the data in the column will be lost.
  - You are about to drop the column `prix` on the `formules` table. All the data in the column will be lost.
  - Added the required column `prixUnitaireHt` to the `commande_empanadas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tauxTva` to the `commande_empanadas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prixUnitaireHt` to the `commande_extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tauxTva` to the `commande_extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prixUnitaireHt` to the `commande_formules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalHt` to the `commandes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTtc` to the `commandes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTva` to the `commandes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prixHt` to the `empanadas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prixHt` to the `extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prixHt` to the `formules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "commande_empanadas" DROP COLUMN "prixUnitaire",
ADD COLUMN     "prixUnitaireHt" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "tauxTva" DECIMAL(4,2) NOT NULL;

-- AlterTable
ALTER TABLE "commande_extras" DROP COLUMN "prixUnitaire",
ADD COLUMN     "prixUnitaireHt" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "tauxTva" DECIMAL(4,2) NOT NULL;

-- AlterTable
ALTER TABLE "commande_formules" DROP COLUMN "prixUnitaire",
ADD COLUMN     "prixUnitaireHt" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "commandes" ADD COLUMN     "totalHt" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalTtc" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "totalTva" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "empanadas" DROP COLUMN "prix",
ADD COLUMN     "prixHt" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "tauxTva" DECIMAL(4,2) NOT NULL DEFAULT 5.5;

-- AlterTable
ALTER TABLE "extras" DROP COLUMN "prix",
ADD COLUMN     "prixHt" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "tauxTva" DECIMAL(4,2) NOT NULL DEFAULT 5.5;

-- AlterTable
ALTER TABLE "formules" DROP COLUMN "prix",
ADD COLUMN     "prixHt" DECIMAL(10,2) NOT NULL;

-- CreateIndex
CREATE INDEX "commandes_statut_dateSouhaitee_idx" ON "commandes"("statut", "dateSouhaitee");

-- CreateIndex
CREATE INDEX "commandes_clientId_idx" ON "commandes"("clientId");

-- CreateIndex
CREATE INDEX "empanadas_actif_idx" ON "empanadas"("actif");
