/*
  Warnings:

  - Added the required column `updatedAt` to the `ApplicationFormFieldValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ApplicationFormStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sponsor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FormField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Organizer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OptionList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Hackathon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Hacker` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ApplicationFormFieldValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationId" INTEGER NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "value" TEXT,
    "fileId" INTEGER,
    "optionId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ApplicationFormFieldValue_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ApplicationFormFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "FormField" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ApplicationFormFieldValue_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ApplicationFormFieldValue_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ApplicationFormFieldValue" ("applicationId", "fieldId", "fileId", "id", "optionId", "value") SELECT "applicationId", "fieldId", "fileId", "id", "optionId", "value" FROM "ApplicationFormFieldValue";
DROP TABLE "ApplicationFormFieldValue";
ALTER TABLE "new_ApplicationFormFieldValue" RENAME TO "ApplicationFormFieldValue";
CREATE UNIQUE INDEX "ApplicationFormFieldValue_fileId_key" ON "ApplicationFormFieldValue"("fileId");
CREATE UNIQUE INDEX "ApplicationFormFieldValue_applicationId_fieldId_key" ON "ApplicationFormFieldValue"("applicationId", "fieldId");
CREATE TABLE "new_Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "listId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Option_listId_fkey" FOREIGN KEY ("listId") REFERENCES "OptionList" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Option" ("id", "listId", "value") SELECT "id", "listId", "value" FROM "Option";
DROP TABLE "Option";
ALTER TABLE "new_Option" RENAME TO "Option";
CREATE TABLE "new_ApplicationFormStep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "hackathonId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ApplicationFormStep_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ApplicationFormStep" ("hackathonId", "id", "position", "title") SELECT "hackathonId", "id", "position", "title" FROM "ApplicationFormStep";
DROP TABLE "ApplicationFormStep";
ALTER TABLE "new_ApplicationFormStep" RENAME TO "ApplicationFormStep";
CREATE TABLE "new_File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_File" ("createdAt", "id", "name", "path") SELECT "createdAt", "id", "name", "path" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hackerId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_hackerId_fkey" FOREIGN KEY ("hackerId") REFERENCES "Hacker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "ApplicationStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("hackerId", "id", "statusId") SELECT "hackerId", "id", "statusId" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_hackerId_key" ON "Application"("hackerId");
CREATE TABLE "new_Sponsor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "hackathonId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Sponsor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sponsor_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sponsor" ("company", "hackathonId", "id", "userId") SELECT "company", "hackathonId", "id", "userId" FROM "Sponsor";
DROP TABLE "Sponsor";
ALTER TABLE "new_Sponsor" RENAME TO "Sponsor";
CREATE UNIQUE INDEX "Sponsor_userId_key" ON "Sponsor"("userId");
CREATE TABLE "new_FormField" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL,
    "stepId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "optionListId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FormField_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "ApplicationFormStep" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormField_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "FormFieldType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormField_optionListId_fkey" FOREIGN KEY ("optionListId") REFERENCES "OptionList" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FormField" ("id", "label", "name", "optionListId", "position", "required", "stepId", "typeId") SELECT "id", "label", "name", "optionListId", "position", "required", "stepId", "typeId" FROM "FormField";
DROP TABLE "FormField";
ALTER TABLE "new_FormField" RENAME TO "FormField";
CREATE TABLE "new_Organizer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Organizer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Organizer" ("id", "userId") SELECT "id", "userId" FROM "Organizer";
DROP TABLE "Organizer";
ALTER TABLE "new_Organizer" RENAME TO "Organizer";
CREATE UNIQUE INDEX "Organizer_userId_key" ON "Organizer"("userId");
CREATE TABLE "new_OptionList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_OptionList" ("id", "name") SELECT "id", "name" FROM "OptionList";
DROP TABLE "OptionList";
ALTER TABLE "new_OptionList" RENAME TO "OptionList";
CREATE UNIQUE INDEX "OptionList_name_key" ON "OptionList"("name");
CREATE TABLE "new_Hackathon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventStartDate" DATETIME NOT NULL,
    "eventEndDate" DATETIME NOT NULL,
    "applicationStartDate" DATETIME NOT NULL,
    "applicationEndDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Hackathon" ("applicationEndDate", "applicationStartDate", "description", "eventEndDate", "eventStartDate", "id", "name") SELECT "applicationEndDate", "applicationStartDate", "description", "eventEndDate", "eventStartDate", "id", "name" FROM "Hackathon";
DROP TABLE "Hackathon";
ALTER TABLE "new_Hackathon" RENAME TO "Hackathon";
CREATE UNIQUE INDEX "Hackathon_name_key" ON "Hackathon"("name");
CREATE TABLE "new_Hacker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT,
    "age" INTEGER,
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER,
    "hackathonId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Hacker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Hacker_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Hacker_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Hacker" ("age", "fullName", "hackathonId", "id", "teamId", "userId") SELECT "age", "fullName", "hackathonId", "id", "teamId", "userId" FROM "Hacker";
DROP TABLE "Hacker";
ALTER TABLE "new_Hacker" RENAME TO "Hacker";
CREATE UNIQUE INDEX "Hacker_userId_key" ON "Hacker"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
