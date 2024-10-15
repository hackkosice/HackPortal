import React from "react";
import ApplicationFormStep from "@/scenes/ApplicationFormStep/ApplicationFormStep";
import getApplicationFormStep from "@/server/getters/application/applicationFormStep";
import { Metadata } from "next";
import requireNonOrganizer from "@/services/helpers/requireNonOrganizer";
import getActiveHackathonId from "@/server/getters/getActiveHackathonId";
import { prisma } from "@/services/prisma";

export const metadata: Metadata = {
  title: "Application Form",
};

const ApplicationFormStepPage = async ({
  params,
}: {
  params: { stepId: string };
}) => {
  await requireNonOrganizer();
  const hackathonId = await getActiveHackathonId(prisma);
  if (!hackathonId) {
    return null;
  }

  const applicationFormStepData = await getApplicationFormStep(
    Number(params.stepId),
    hackathonId
  );
  return (
    <ApplicationFormStep
      data={applicationFormStepData}
      stepId={Number(params.stepId)}
    />
  );
};

export default ApplicationFormStepPage;
