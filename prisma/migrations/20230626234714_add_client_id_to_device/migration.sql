/*
  Warnings:

  - Added the required column `clientId` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Device" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "caption" TEXT NOT NULL,
    "deviceTypeId" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Device_deviceTypeId_fkey" FOREIGN KEY ("deviceTypeId") REFERENCES "DeviceType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Device_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Device" ("caption", "createdAt", "deviceTypeId", "id", "ownerId", "updatedAt") SELECT "caption", "createdAt", "deviceTypeId", "id", "ownerId", "updatedAt" FROM "Device";
DROP TABLE "Device";
ALTER TABLE "new_Device" RENAME TO "Device";
CREATE UNIQUE INDEX "Device_clientId_key" ON "Device"("clientId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
