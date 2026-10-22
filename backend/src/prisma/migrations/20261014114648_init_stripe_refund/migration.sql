-- CreateEnum
CREATE TYPE "MotifRemboursement" AS ENUM ('STOCK_INSUFFISANT', 'COMMANDE_INFAISABLE', 'ERREUR_COMMANDE', 'GESTE_COMMERCIAL', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutRemboursement" AS ENUM ('EN_COURS', 'REUSSI', 'ECHOUE');

-- AlterEnum
ALTER TYPE "StatutCommande" ADD VALUE 'REMBOURSEE';

-- CreateTable
CREATE TABLE "remboursements" (
    "id" SERIAL NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "motif" "MotifRemboursement" NOT NULL,
    "commentaire" TEXT,
    "statut" "StatutRemboursement" NOT NULL DEFAULT 'EN_COURS',
    "stripeRefundId" TEXT,
    "demandeParId" INTEGER NOT NULL,
    "demandeParNom" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "traiteLe" TIMESTAMP(3),

    CONSTRAINT "remboursements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "remboursements_stripeRefundId_key" ON "remboursements"("stripeRefundId");

-- CreateIndex
CREATE INDEX "remboursements_commandeId_idx" ON "remboursements"("commandeId");

-- AddForeignKey
ALTER TABLE "remboursements" ADD CONSTRAINT "remboursements_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "commandes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
