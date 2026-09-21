-- CreateEnum
CREATE TYPE "TypeEmpanada" AS ENUM ('SALEE', 'SUCREE', 'VEGETARIEN');

-- CreateEnum
CREATE TYPE "TypeExtra" AS ENUM ('DOUCEUR', 'BOISSON');

-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('EN_ATTENTE', 'VALIDEE', 'RECUPEREE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "ModeRecuperation" AS ENUM ('RETRAIT', 'LIVRAISON');

-- CreateEnum
CREATE TYPE "RoleUtilisateur" AS ENUM ('ADMIN', 'EMPLOYE');

-- CreateTable
CREATE TABLE "empanadas" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" DECIMAL(65,30) NOT NULL,
    "type" "TypeEmpanada" NOT NULL,
    "sansGluten" BOOLEAN NOT NULL DEFAULT false,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "empanadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extras" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TypeExtra" NOT NULL,
    "prix" DECIMAL(65,30) NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "extras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formules" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" DECIMAL(65,30) NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "formules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formule_empanadas" (
    "id" SERIAL NOT NULL,
    "formuleId" INTEGER NOT NULL,
    "empanadaId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,

    CONSTRAINT "formule_empanadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "RoleUtilisateur" NOT NULL DEFAULT 'EMPLOYE',
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandes" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "clientNom" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientTelephone" TEXT NOT NULL,
    "statut" "StatutCommande" NOT NULL DEFAULT 'EN_ATTENTE',
    "modeRecuperation" "ModeRecuperation" NOT NULL,
    "adresseLivraison" TEXT,
    "dateSouhaitee" TIMESTAMP(3) NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commandes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commande_empanadas" (
    "id" SERIAL NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "empanadaId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prixUnitaire" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "commande_empanadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commande_extras" (
    "id" SERIAL NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "extraId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prixUnitaire" DECIMAL(65,30),

    CONSTRAINT "commande_extras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commande_formules" (
    "id" SERIAL NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "formuleId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prixUnitaire" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "commande_formules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "commandes_reference_key" ON "commandes"("reference");

-- AddForeignKey
ALTER TABLE "formule_empanadas" ADD CONSTRAINT "formule_empanadas_formuleId_fkey" FOREIGN KEY ("formuleId") REFERENCES "formules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formule_empanadas" ADD CONSTRAINT "formule_empanadas_empanadaId_fkey" FOREIGN KEY ("empanadaId") REFERENCES "empanadas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_empanadas" ADD CONSTRAINT "commande_empanadas_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "commandes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_empanadas" ADD CONSTRAINT "commande_empanadas_empanadaId_fkey" FOREIGN KEY ("empanadaId") REFERENCES "empanadas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_extras" ADD CONSTRAINT "commande_extras_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "commandes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_extras" ADD CONSTRAINT "commande_extras_extraId_fkey" FOREIGN KEY ("extraId") REFERENCES "extras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_formules" ADD CONSTRAINT "commande_formules_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "commandes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commande_formules" ADD CONSTRAINT "commande_formules_formuleId_fkey" FOREIGN KEY ("formuleId") REFERENCES "formules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
