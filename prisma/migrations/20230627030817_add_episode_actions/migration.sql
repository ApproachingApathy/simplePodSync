-- CreateTable
CREATE TABLE "EpisodeAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "episodeUrl" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "started" INTEGER,
    "position" INTEGER,
    "total" INTEGER,
    "episodeActionTypeId" INTEGER NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    CONSTRAINT "EpisodeAction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EpisodeAction_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EpisodeAction_episodeActionTypeId_fkey" FOREIGN KEY ("episodeActionTypeId") REFERENCES "EpisodeActionType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EpisodeActionType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EpisodeActionType_value_key" ON "EpisodeActionType"("value");
