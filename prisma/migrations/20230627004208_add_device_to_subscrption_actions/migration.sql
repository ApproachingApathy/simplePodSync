/*
  Warnings:

  - Added the required column `deviceId` to the `SubscriptionAction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SubscriptionAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriptionId" TEXT NOT NULL,
    "actionTypeId" INTEGER NOT NULL,
    "deviceId" TEXT NOT NULL,
    CONSTRAINT "SubscriptionAction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubscriptionAction_actionTypeId_fkey" FOREIGN KEY ("actionTypeId") REFERENCES "SubscriptionActionType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubscriptionAction_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SubscriptionAction" ("actionTypeId", "createdAt", "id", "subscriptionId") SELECT "actionTypeId", "createdAt", "id", "subscriptionId" FROM "SubscriptionAction";
DROP TABLE "SubscriptionAction";
ALTER TABLE "new_SubscriptionAction" RENAME TO "SubscriptionAction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
