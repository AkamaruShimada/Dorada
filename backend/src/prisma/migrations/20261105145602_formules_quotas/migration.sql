/*
  Warnings:

  - You are about to drop the column `nombreEmpanadas` on the `formules` table. All the data in the column will be lost.
  - You are about to drop the column `nombreExtras` on the `formules` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CibleQuota" AS ENUM ('EMPANADA', 'EXTRA');

-- AlterTable
ALTER TABLE "formules" DROP COLUMN "nombreEmpanadas",
DROP COLUMN "nombreExtras";

-- CreateTable
CREATE TABLE "formule_quotas" (
    "id" SERIAL NOT NULL,
    "formuleId" INTEGER NOT NULL,
    "cible" "CibleQuota" NOT NULL,
    "typeExtra" "TypeExtra",
    "typeEmpanada" "TypeEmpanada",
    "quantite" INTEGER NOT NULL,

    CONSTRAINT "formule_quotas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "formule_quotas_formuleId_cible_typeExtra_typeEmpanada_key" ON "formule_quotas"("formuleId", "cible", "typeExtra", "typeEmpanada");

-- AddForeignKey
ALTER TABLE "formule_quotas" ADD CONSTRAINT "formule_quotas_formuleId_fkey" FOREIGN KEY ("formuleId") REFERENCES "formules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
