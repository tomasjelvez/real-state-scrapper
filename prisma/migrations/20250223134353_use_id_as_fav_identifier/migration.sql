/*
  Warnings:

  - You are about to drop the column `propertyHref` on the `Favorite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,propertyId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `propertyId` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Favorite_userId_propertyHref_key";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "propertyHref",
ADD COLUMN     "propertyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_propertyId_key" ON "Favorite"("userId", "propertyId");
