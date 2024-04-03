/*
  Warnings:

  - You are about to drop the column `challengeId` on the `Team` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ChallengeToTeam" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ChallengeToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ChallengeToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "tableId" INTEGER,
    CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Hacker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Team_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("code", "id", "name", "ownerId", "tableId") SELECT "code", "id", "name", "ownerId", "tableId" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
CREATE UNIQUE INDEX "Team_code_key" ON "Team"("code");
CREATE UNIQUE INDEX "Team_ownerId_key" ON "Team"("ownerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_ChallengeToTeam_AB_unique" ON "_ChallengeToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_ChallengeToTeam_B_index" ON "_ChallengeToTeam"("B");
