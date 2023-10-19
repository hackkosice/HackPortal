import React from "react";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import FormStepEditor from "@/scenes/Dashboard/ApplicationFormEditor/scenes/EditStepForm/FormStepEditor";
import getStepInfo from "@/server/getters/dashboard/stepInfo";
import getFormFieldTypes from "@/server/getters/dashboard/formFieldTypes";

export const metadata: Metadata = {
  title: "Edit application form step",
};

const DashboardPage = async ({ params }: { params: { stepId: string } }) => {
  if (!(await requireOrganizerApp())) {
    redirect("/application");
  }
  const stepInfo = await getStepInfo(Number(params.stepId));
  const formFieldTypes = await getFormFieldTypes();
  return <FormStepEditor stepInfo={stepInfo} formFieldTypes={formFieldTypes} />;
};

export default DashboardPage;
