/*
  Warnings:

  - Added the required column `totalTtc` to the `commande_formules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "commande_formules" ADD COLUMN     "totalTtc" DECIMAL(10,2) NOT NULL;
