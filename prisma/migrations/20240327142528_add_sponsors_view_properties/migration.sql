-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FormField" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "name" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL,
    "shownInList" BOOLEAN NOT NULL DEFAULT false,
    "shownInCheckin" BOOLEAN NOT NULL DEFAULT false,
    "shownInSponsorsViewTable" BOOLEAN NOT NULL DEFAULT false,
    "shownInSponsorsViewDetails" BOOLEAN NOT NULL DEFAULT false,
    "stepId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "optionListId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FormField_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "ApplicationFormStep" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormField_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "FormFieldType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormField_optionListId_fkey" FOREIGN KEY ("optionListId") REFERENCES "OptionList" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FormField" ("createdAt", "description", "id", "label", "name", "optionListId", "position", "required", "shownInCheckin", "shownInList", "stepId", "typeId", "updatedAt") SELECT "createdAt", "description", "id", "label", "name", "optionListId", "position", "required", "shownInCheckin", "shownInList", "stepId", "typeId", "updatedAt" FROM "FormField";
DROP TABLE "FormField";
ALTER TABLE "new_FormField" RENAME TO "FormField";
CREATE UNIQUE INDEX "FormField_stepId_position_key" ON "FormField"("stepId", "position");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
