import React from "react";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import ApplicationFormEditor from "@/scenes/Dashboard/scenes/ApplicationFormEditor/ApplicationFormEditor";
import getApplicationFormSteps from "@/server/getters/dashboard/applicationFormSteps";

export const metadata: Metadata = {
  title: "Edit application form",
};

const FormEditorPage = async () => {
  if (!(await requireOrganizerApp())) {
    redirect("/application");
  }
  const applicationFormSteps = await getApplicationFormSteps();

  return <ApplicationFormEditor applicationFormSteps={applicationFormSteps} />;
};

export default FormEditorPage;
