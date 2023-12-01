-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "password" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN DEFAULT false,
    "emailVerificationToken" TEXT,
    "forgotPasswordToken" TEXT,
    "image" TEXT
);
INSERT INTO "new_User" ("email", "emailVerificationToken", "emailVerified", "forgotPasswordToken", "id", "image", "name", "password") SELECT "email", "emailVerificationToken", "emailVerified", "forgotPasswordToken", "id", "image", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
