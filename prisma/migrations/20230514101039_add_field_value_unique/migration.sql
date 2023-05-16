/*
  Warnings:

  - A unique constraint covering the columns `[applicationId,fieldId]` on the table `ApplicationFormFieldValue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ApplicationFormFieldValue_applicationId_fieldId_key" ON "ApplicationFormFieldValue"("applicationId", "fieldId");
