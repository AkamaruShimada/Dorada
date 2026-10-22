-- AlterTable
ALTER TABLE "commandes" ADD COLUMN     "codePromoFige" TEXT,
ADD COLUMN     "codePromoId" INTEGER,
ADD COLUMN     "remisePourcent" DECIMAL(5,2),
ADD COLUMN     "remiseTtc" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CodePromo" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "pourcentage" DECIMAL(5,2) NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "dateExpiration" TIMESTAMP(3),
    "usagesMax" INTEGER,
    "usagesActuels" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodePromo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CodePromo_code_key" ON "CodePromo"("code");

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_codePromoId_fkey" FOREIGN KEY ("codePromoId") REFERENCES "CodePromo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
