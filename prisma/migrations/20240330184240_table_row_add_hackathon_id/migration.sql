/*
  Warnings:

  - Added the required column `hackathonId` to the `TableRow` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TableRow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hackathonId" INTEGER NOT NULL,
    CONSTRAINT "TableRow_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TableRow" ("id") SELECT "id" FROM "TableRow";
DROP TABLE "TableRow";
ALTER TABLE "new_TableRow" RENAME TO "TableRow";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
