-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hackathon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "maxTeamSize" INTEGER NOT NULL DEFAULT 4,
    "eventStartDate" DATETIME NOT NULL,
    "eventEndDate" DATETIME NOT NULL,
    "applicationStartDate" DATETIME NOT NULL,
    "applicationEndDate" DATETIME NOT NULL,
    "travelReimbursementDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Hackathon" ("applicationEndDate", "applicationStartDate", "createdAt", "description", "eventEndDate", "eventStartDate", "id", "name", "title", "travelReimbursementDescription", "updatedAt") SELECT "applicationEndDate", "applicationStartDate", "createdAt", "description", "eventEndDate", "eventStartDate", "id", "name", "title", "travelReimbursementDescription", "updatedAt" FROM "Hackathon";
DROP TABLE "Hackathon";
ALTER TABLE "new_Hackathon" RENAME TO "Hackathon";
CREATE UNIQUE INDEX "Hackathon_name_key" ON "Hackathon"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
