import React from "react";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import FormStepEditor from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/FormStepEditor";
import getStepInfo from "@/server/getters/dashboard/stepInfo";

export const metadata: Metadata = {
  title: "Edit application form step",
};

const FormEditorStepPage = async ({
  params,
}: {
  params: { stepId: string };
}) => {
  if (!(await requireOrganizerApp())) {
    redirect("/application");
  }
  const stepInfo = await getStepInfo(Number(params.stepId));

  return <FormStepEditor stepInfo={stepInfo} />;
};

export default FormEditorStepPage;
