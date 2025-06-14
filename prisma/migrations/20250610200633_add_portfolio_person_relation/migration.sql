/*
  Warnings:

  - You are about to drop the column `name` on the `PortfolioItem` table. All the data in the column will be lost.
  - Added the required column `personId` to the `PortfolioItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `PortfolioItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PortfolioItem" DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "personId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
