/*
  Warnings:

  - A unique constraint covering the columns `[clientId,ownerId]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Device_clientId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Device_clientId_ownerId_key" ON "Device"("clientId", "ownerId");
