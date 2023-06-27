/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_url_key" ON "Subscription"("url");
