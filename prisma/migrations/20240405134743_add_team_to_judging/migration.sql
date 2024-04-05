/*
  Warnings:

  - Added the required column `teamId` to the `TeamJudging` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TeamJudging" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judgingVerdict" TEXT,
    "organizerId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "judgingSlotId" INTEGER NOT NULL,
    CONSTRAINT "TeamJudging_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeamJudging_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeamJudging_judgingSlotId_fkey" FOREIGN KEY ("judgingSlotId") REFERENCES "JudgingSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TeamJudging" ("id", "judgingSlotId", "judgingVerdict", "organizerId") SELECT "id", "judgingSlotId", "judgingVerdict", "organizerId" FROM "TeamJudging";
DROP TABLE "TeamJudging";
ALTER TABLE "new_TeamJudging" RENAME TO "TeamJudging";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
