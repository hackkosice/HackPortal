/*
  Warnings:

  - You are about to drop the column `landingPageTitle` on the `ApplicationFormStep` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ApplicationFormStep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "hackathonId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ApplicationFormStep_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ApplicationFormStep" ("createdAt", "description", "hackathonId", "id", "position", "title", "updatedAt") SELECT "createdAt", "description", "hackathonId", "id", "position", "title", "updatedAt" FROM "ApplicationFormStep";
DROP TABLE "ApplicationFormStep";
ALTER TABLE "new_ApplicationFormStep" RENAME TO "ApplicationFormStep";
CREATE UNIQUE INDEX "ApplicationFormStep_hackathonId_position_key" ON "ApplicationFormStep"("hackathonId", "position");
CREATE TABLE "new_Hackathon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "eventStartDate" DATETIME NOT NULL,
    "eventEndDate" DATETIME NOT NULL,
    "applicationStartDate" DATETIME NOT NULL,
    "applicationEndDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Hackathon" ("applicationEndDate", "applicationStartDate", "createdAt", "description", "eventEndDate", "eventStartDate", "id", "name", "updatedAt") SELECT "applicationEndDate", "applicationStartDate", "createdAt", "description", "eventEndDate", "eventStartDate", "id", "name", "updatedAt" FROM "Hackathon";
DROP TABLE "Hackathon";
ALTER TABLE "new_Hackathon" RENAME TO "Hackathon";
CREATE UNIQUE INDEX "Hackathon_name_key" ON "Hackathon"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
