/*
  Warnings:

  - Added the required column `formFieldNumber` to the `FormField` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FormField" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "formFieldNumber" INTEGER NOT NULL,
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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
