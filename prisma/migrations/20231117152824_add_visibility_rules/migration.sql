-- CreateTable
CREATE TABLE "FormFieldVisibilityRule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "formFieldId" INTEGER NOT NULL,
    "targetFormFieldId" INTEGER NOT NULL,
    "targetOptionId" INTEGER NOT NULL,
    CONSTRAINT "FormFieldVisibilityRule_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormField" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormFieldVisibilityRule_targetFormFieldId_fkey" FOREIGN KEY ("targetFormFieldId") REFERENCES "FormField" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FormFieldVisibilityRule_targetOptionId_fkey" FOREIGN KEY ("targetOptionId") REFERENCES "Option" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
