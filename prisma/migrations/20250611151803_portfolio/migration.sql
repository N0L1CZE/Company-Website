/*
  Warnings:

  - You are about to drop the column `personId` on the `PortfolioItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PortfolioItem" DROP CONSTRAINT "PortfolioItem_personId_fkey";

-- AlterTable
ALTER TABLE "PortfolioItem" DROP COLUMN "personId";

-- CreateTable
CREATE TABLE "_PortfolioPersons" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PortfolioPersons_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PortfolioPersons_B_index" ON "_PortfolioPersons"("B");

-- AddForeignKey
ALTER TABLE "_PortfolioPersons" ADD CONSTRAINT "_PortfolioPersons_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PortfolioPersons" ADD CONSTRAINT "_PortfolioPersons_B_fkey" FOREIGN KEY ("B") REFERENCES "PortfolioItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
