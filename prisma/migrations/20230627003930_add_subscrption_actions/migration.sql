/*
  Warnings:

  - You are about to drop the column `deviceId` on the `Subscription` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "SubscriptionAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriptionId" TEXT NOT NULL,
    "actionTypeId" INTEGER NOT NULL,
    CONSTRAINT "SubscriptionAction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubscriptionAction_actionTypeId_fkey" FOREIGN KEY ("actionTypeId") REFERENCES "SubscriptionActionType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubscriptionActionType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DeviceType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" TEXT NOT NULL
);
INSERT INTO "new_DeviceType" ("id", "value") SELECT "id", "value" FROM "DeviceType";
DROP TABLE "DeviceType";
ALTER TABLE "new_DeviceType" RENAME TO "DeviceType";
CREATE UNIQUE INDEX "DeviceType_value_key" ON "DeviceType"("value");
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL
);
INSERT INTO "new_Subscription" ("id", "url") SELECT "id", "url" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
