-- CreateTable
CREATE TABLE "TableRow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "HackerTable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Space" TEXT NOT NULL,
    "rowId" INTEGER NOT NULL,
    CONSTRAINT "HackerTable_rowId_fkey" FOREIGN KEY ("rowId") REFERENCES "TableRow" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "hackerTableId" INTEGER,
    CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Hacker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Team_hackerTableId_fkey" FOREIGN KEY ("hackerTableId") REFERENCES "HackerTable" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("code", "id", "name", "ownerId") SELECT "code", "id", "name", "ownerId" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
CREATE UNIQUE INDEX "Team_code_key" ON "Team"("code");
CREATE UNIQUE INDEX "Team_ownerId_key" ON "Team"("ownerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
