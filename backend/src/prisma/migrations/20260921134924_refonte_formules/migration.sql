/*
  Warnings:

  - You are about to drop the `formule_empanadas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nombreEmpanadas` to the `formules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "formule_empanadas" DROP CONSTRAINT "formule_empanadas_empanadaId_fkey";

-- DropForeignKey
ALTER TABLE "formule_empanadas" DROP CONSTRAINT "formule_empanadas_formuleId_fkey";

-- AlterTable
ALTER TABLE "commande_empanadas" ADD COLUMN     "commandeFormuleId" INTEGER,
ALTER COLUMN "prixUnitaire" DROP NOT NULL;

-- AlterTable
ALTER TABLE "commande_extras" ADD COLUMN     "commandeFormuleId" INTEGER;

-- AlterTable
ALTER TABLE "formules" ADD COLUMN     "nombreEmpanadas" INTEGER NOT NULL,
ADD COLUMN     "nombreExtras" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "formule_empanadas";

-- AddForeignKey
ALTER TABLE "commande_empanadas" ADD CONSTRAINT "commande_empanadas_commandeFormuleId_fkey" FOREIGN KEY ("commandeFormuleId") REFERENCES "commande_formules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_extras" ADD CONSTRAINT "commande_extras_commandeFormuleId_fkey" FOREIGN KEY ("commandeFormuleId") REFERENCES "commande_formules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
