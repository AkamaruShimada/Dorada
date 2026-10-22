/*
  Warnings:

  - The values [COMMANDE_INFAISABLE] on the enum `MotifRemboursement` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MotifRemboursement_new" AS ENUM ('STOCK_INSUFFISANT', 'CAPACITE_DEPASSEE', 'ERREUR_COMMANDE', 'GESTE_COMMERCIAL', 'AUTRE');
ALTER TABLE "remboursements" ALTER COLUMN "motif" TYPE "MotifRemboursement_new" USING ("motif"::text::"MotifRemboursement_new");
ALTER TYPE "MotifRemboursement" RENAME TO "MotifRemboursement_old";
ALTER TYPE "MotifRemboursement_new" RENAME TO "MotifRemboursement";
DROP TYPE "public"."MotifRemboursement_old";
COMMIT;
