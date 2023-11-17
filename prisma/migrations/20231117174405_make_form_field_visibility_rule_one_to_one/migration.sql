/*
  Warnings:

  - A unique constraint covering the columns `[formFieldId]` on the table `FormFieldVisibilityRule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FormFieldVisibilityRule_formFieldId_key" ON "FormFieldVisibilityRule"("formFieldId");
