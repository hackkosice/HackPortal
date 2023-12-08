import React from "react";
import ApplicationFormStep from "@/scenes/ApplicationFormStep/ApplicationFormStep";
import getApplicationFormStep from "@/server/getters/application/applicationFormStep";
import { Metadata } from "next";
import requireNonOrganizer from "@/services/helpers/requireNonOrganizer";

export const metadata: Metadata = {
  title: "Application Form",
};

const ApplicationFormStepPage = async ({
  params,
}: {
  params: { stepId: string };
}) => {
  await requireNonOrganizer();
  const applicationFormStepData = await getApplicationFormStep(
    Number(params.stepId)
  );
  return (
    <ApplicationFormStep
      data={applicationFormStepData}
      stepId={Number(params.stepId)}
    />
  );
};

export default ApplicationFormStepPage;
