/*
  Warnings:

  - A unique constraint covering the columns `[userId,hackathonId]` on the table `Hacker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Hacker_userId_hackathonId_key" ON "Hacker"("userId", "hackathonId");
