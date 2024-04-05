import React from "react";
import { Metadata } from "next";
import FormStepEditor from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/FormStepEditor";
import requireAdmin from "@/services/helpers/requireAdmin";
import { disallowVolunteer } from "@/services/helpers/disallowVolunteer";

export const metadata: Metadata = {
  title: "Edit application form step",
};

const FormEditorStepPage = async ({
  params,
}: {
  params: { stepId: string; hackathonId: string };
}) => {
  await disallowVolunteer(params.hackathonId);
  await requireAdmin();

  return (
    <FormStepEditor
      hackathonId={Number(params.hackathonId)}
      stepId={Number(params.stepId)}
    />
  );
};

export default FormEditorStepPage;
