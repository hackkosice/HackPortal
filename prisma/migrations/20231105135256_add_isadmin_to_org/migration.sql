-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Organizer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "currentApplicationForReviewId" INTEGER,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Organizer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Organizer_currentApplicationForReviewId_fkey" FOREIGN KEY ("currentApplicationForReviewId") REFERENCES "Application" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Organizer" ("createdAt", "currentApplicationForReviewId", "id", "updatedAt", "userId") SELECT "createdAt", "currentApplicationForReviewId", "id", "updatedAt", "userId" FROM "Organizer";
DROP TABLE "Organizer";
ALTER TABLE "new_Organizer" RENAME TO "Organizer";
CREATE UNIQUE INDEX "Organizer_userId_key" ON "Organizer"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
