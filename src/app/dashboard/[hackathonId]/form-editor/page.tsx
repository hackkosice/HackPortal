import React from "react";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import { Metadata } from "next";
import ApplicationFormEditor from "@/scenes/Dashboard/scenes/ApplicationFormEditor/ApplicationFormEditor";
import getApplicationFormSteps from "@/server/getters/dashboard/applicationFormSteps";

export const metadata: Metadata = {
  title: "Edit application form",
};

const FormEditorPage = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await requireOrganizerApp();
  const applicationFormSteps = await getApplicationFormSteps(
    Number(hackathonId)
  );

  return (
    <ApplicationFormEditor
      applicationFormSteps={applicationFormSteps}
      hackathonId={Number(hackathonId)}
    />
  );
};

export default FormEditorPage;
