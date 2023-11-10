import React from "react";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import { Metadata } from "next";
import FormStepEditor from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/FormStepEditor";

export const metadata: Metadata = {
  title: "Edit application form step",
};

const FormEditorStepPage = async ({
  params,
}: {
  params: { stepId: string; hackathonId: string };
}) => {
  await requireOrganizerApp();

  return (
    <FormStepEditor
      hackathonId={Number(params.hackathonId)}
      stepId={Number(params.stepId)}
    />
  );
};

export default FormEditorStepPage;
