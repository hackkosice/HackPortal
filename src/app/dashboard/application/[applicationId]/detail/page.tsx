import React from "react";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import ApplicationDetail from "@/scenes/Dashboard/scenes/ApplicationDetail/ApplicationDetail";
import getApplicationDetail from "@/server/getters/dashboard/applicationDetail";

export const metadata: Metadata = {
  title: "Application detail",
};

const ApplicationDetailPage = async ({
  params,
}: {
  params: { applicationId: string };
}) => {
  if (!(await requireOrganizerApp())) {
    redirect("/application");
  }
  const applicationDetail = await getApplicationDetail(
    Number(params.applicationId)
  );
  return <ApplicationDetail applicationDetail={applicationDetail} />;
};

export default ApplicationDetailPage;
