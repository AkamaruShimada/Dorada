-- AlterEnum
ALTER TYPE "StatutCommande" ADD VALUE 'EXPIREE';

-- CreateTable
CREATE TABLE "stripe_evenements" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "traiteLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stripe_evenements_pkey" PRIMARY KEY ("id")
);
