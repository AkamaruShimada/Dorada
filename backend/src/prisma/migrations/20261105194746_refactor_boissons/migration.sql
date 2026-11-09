/*
  Warnings:

  - You are about to drop the column `type` on the `extras` table. All the data in the column will be lost.
  - You are about to drop the `formule_quotas` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `sansGluten` on table `extras` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "formule_quotas" DROP CONSTRAINT "formule_quotas_formuleId_fkey";

-- AlterTable
ALTER TABLE "empanadas" ALTER COLUMN "tauxTva" SET DEFAULT 10;

-- AlterTable
ALTER TABLE "extras" DROP COLUMN "type",
ALTER COLUMN "sansGluten" SET NOT NULL;

-- AlterTable
ALTER TABLE "formules" ADD COLUMN     "nombreBoissons" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nombreEmpanadas" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nombreExtras" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "formule_quotas";

-- DropEnum
DROP TYPE "CibleQuota";

-- DropEnum
DROP TYPE "TypeExtra";

-- CreateTable
CREATE TABLE "boissons" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "prixHt" DECIMAL(10,2) NOT NULL,
    "tauxTva" DECIMAL(4,2) NOT NULL DEFAULT 5.5,
    "supplementFormuleTtc" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "image_url" TEXT,

    CONSTRAINT "boissons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commande_boissons" (
    "id" SERIAL NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "boissonId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "nomFige" TEXT NOT NULL,
    "prixUnitaireHt" DECIMAL(10,2) NOT NULL,
    "tauxTva" DECIMAL(4,2) NOT NULL,
    "supplementTtc" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalHt" DECIMAL(10,2) NOT NULL,
    "totalTva" DECIMAL(10,2) NOT NULL,
    "totalTtc" DECIMAL(10,2) NOT NULL,
    "commandeFormuleId" INTEGER,

    CONSTRAINT "commande_boissons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "boissons_actif_idx" ON "boissons"("actif");

-- CreateIndex
CREATE INDEX "commande_boissons_commandeId_idx" ON "commande_boissons"("commandeId");

-- CreateIndex
CREATE INDEX "commande_boissons_commandeFormuleId_idx" ON "commande_boissons"("commandeFormuleId");

-- AddForeignKey
ALTER TABLE "commande_boissons" ADD CONSTRAINT "commande_boissons_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "commandes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_boissons" ADD CONSTRAINT "commande_boissons_boissonId_fkey" FOREIGN KEY ("boissonId") REFERENCES "boissons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_boissons" ADD CONSTRAINT "commande_boissons_commandeFormuleId_fkey" FOREIGN KEY ("commandeFormuleId") REFERENCES "commande_formules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
