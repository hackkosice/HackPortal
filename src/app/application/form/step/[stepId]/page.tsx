import React from "react";
import ApplicationFormStep from "@/scenes/ApplicationFormStep/ApplicationFormStep";
import { redirect } from "next/navigation";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import getApplicationFormStep from "@/server/getters/applicationFormStep";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Form",
};

const ApplicationFormStepPage = async ({
  params,
}: {
  params: { stepId: string };
}) => {
  if (await requireOrganizerApp()) {
    redirect("/dashboard");
    return;
  }
  const applicationFormStepData = await getApplicationFormStep(
    Number(params.stepId)
  );
  return <ApplicationFormStep data={applicationFormStepData} />;
};

export default ApplicationFormStepPage;
