/*
  Warnings:

  - You are about to drop the column `formFieldNumber` on the `FormField` table. All the data in the column will be lost.
  - You are about to drop the column `stepNumber` on the `ApplicationFormStep` table. All the data in the column will be lost.
  - Added the required column `position` to the `FormField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hackathonId` to the `ApplicationFormStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `ApplicationFormStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hackathonId` to the `Sponsor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hackathonId` to the `Hacker` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Hackathon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventStartDate" DATETIME NOT NULL,
    "eventEndDate" DATETIME NOT NULL,
    "applicationStartDate" DATETIME NOT NULL,
    "applicationEndDate" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FormField" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL,
    "stepId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "optionListId" INTEGER,
    CONSTRAINT "FormField_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "ApplicationFormStep" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormField_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "FormFieldType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormField_optionListId_fkey" FOREIGN KEY ("optionListId") REFERENCES "OptionList" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FormField" ("id", "label", "name", "optionListId", "required", "stepId", "typeId") SELECT "id", "label", "name", "optionListId", "required", "stepId", "typeId" FROM "FormField";
DROP TABLE "FormField";
ALTER TABLE "new_FormField" RENAME TO "FormField";
CREATE TABLE "new_ApplicationFormStep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "hackathonId" INTEGER NOT NULL,
    CONSTRAINT "ApplicationFormStep_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ApplicationFormStep" ("id", "title") SELECT "id", "title" FROM "ApplicationFormStep";
DROP TABLE "ApplicationFormStep";
ALTER TABLE "new_ApplicationFormStep" RENAME TO "ApplicationFormStep";
CREATE TABLE "new_Sponsor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "hackathonId" INTEGER NOT NULL,
    CONSTRAINT "Sponsor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sponsor_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sponsor" ("company", "id", "userId") SELECT "company", "id", "userId" FROM "Sponsor";
DROP TABLE "Sponsor";
ALTER TABLE "new_Sponsor" RENAME TO "Sponsor";
CREATE UNIQUE INDEX "Sponsor_userId_key" ON "Sponsor"("userId");
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Hacker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("code", "id", "name") SELECT "code", "id", "name" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
CREATE UNIQUE INDEX "Team_code_key" ON "Team"("code");
CREATE UNIQUE INDEX "Team_ownerId_key" ON "Team"("ownerId");
CREATE TABLE "new_Hacker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT,
    "age" INTEGER,
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER,
    "hackathonId" INTEGER NOT NULL,
    CONSTRAINT "Hacker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Hacker_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hacker_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Hacker" ("age", "fullName", "id", "teamId", "userId") SELECT "age", "fullName", "id", "teamId", "userId" FROM "Hacker";
DROP TABLE "Hacker";
ALTER TABLE "new_Hacker" RENAME TO "Hacker";
CREATE UNIQUE INDEX "Hacker_userId_key" ON "Hacker"("userId");
CREATE UNIQUE INDEX "Hacker_hackathonId_key" ON "Hacker"("hackathonId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Hackathon_name_key" ON "Hackathon"("name");
