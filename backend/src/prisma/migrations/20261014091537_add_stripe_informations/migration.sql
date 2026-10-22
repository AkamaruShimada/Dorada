/*
  Warnings:

  - The values [EN_ATTENTE] on the enum `StatutCommande` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[stripeSessionId]` on the table `commandes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatutCommande_new" AS ENUM ('EN_ATTENTE_PAIMENT', 'VALIDEE', 'RECUPEREE', 'ANNULEE');
ALTER TABLE "public"."commandes" ALTER COLUMN "statut" DROP DEFAULT;
ALTER TABLE "commandes" ALTER COLUMN "statut" TYPE "StatutCommande_new" USING ("statut"::text::"StatutCommande_new");
ALTER TYPE "StatutCommande" RENAME TO "StatutCommande_old";
ALTER TYPE "StatutCommande_new" RENAME TO "StatutCommande";
DROP TYPE "public"."StatutCommande_old";
ALTER TABLE "commandes" ALTER COLUMN "statut" SET DEFAULT 'EN_ATTENTE_PAIMENT';
COMMIT;

-- AlterTable
ALTER TABLE "commandes" ADD COLUMN     "payeeLe" TIMESTAMP(3),
ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "stripeSessionId" TEXT,
ALTER COLUMN "statut" SET DEFAULT 'EN_ATTENTE_PAIMENT';

-- CreateIndex
CREATE UNIQUE INDEX "commandes_stripeSessionId_key" ON "commandes"("stripeSessionId");
