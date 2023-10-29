/*
  Warnings:

  - You are about to drop the column `age` on the `Hacker` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Hacker` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hacker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER,
    "hackathonId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Hacker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Hacker_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hacker_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Hacker" ("createdAt", "hackathonId", "id", "teamId", "updatedAt", "userId") SELECT "createdAt", "hackathonId", "id", "teamId", "updatedAt", "userId" FROM "Hacker";
DROP TABLE "Hacker";
ALTER TABLE "new_Hacker" RENAME TO "Hacker";
CREATE UNIQUE INDEX "Hacker_userId_key" ON "Hacker"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
