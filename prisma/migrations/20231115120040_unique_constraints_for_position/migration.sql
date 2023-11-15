/*
  Warnings:

  - A unique constraint covering the columns `[hackathonId,position]` on the table `ApplicationFormStep` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stepId,position]` on the table `FormField` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ApplicationFormStep_hackathonId_position_key" ON "ApplicationFormStep"("hackathonId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "FormField_stepId_position_key" ON "FormField"("stepId", "position");
