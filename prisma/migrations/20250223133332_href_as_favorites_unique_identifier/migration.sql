/*
  Warnings:

  - A unique constraint covering the columns `[userId,propertyHref]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `propertyHref` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "propertyHref" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_propertyHref_key" ON "Favorite"("userId", "propertyHref");
