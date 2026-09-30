-- AlterTable
ALTER TABLE "commandes" ADD COLUMN     "clientId" INTEGER;

-- AlterTable
ALTER TABLE "empanadas" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "extras" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "formules" ADD COLUMN     "image_url" TEXT;

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "telephone" TEXT,
    "pointsFidelite" INTEGER NOT NULL DEFAULT 0,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
