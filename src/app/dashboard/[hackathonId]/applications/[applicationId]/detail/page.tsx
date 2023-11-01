import React from "react";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import ApplicationDetailCard from "@/scenes/Dashboard/scenes/ApplicationDetail/ApplicationDetailCard";
import getApplicationDetail from "@/server/getters/dashboard/applicationDetail";

export const metadata: Metadata = {
  title: "Application detail",
};

const ApplicationDetailPage = async ({
  params,
}: {
  params: { applicationId: string; hackathonId: string };
}) => {
  if (!(await requireOrganizerApp())) {
    redirect("/application");
  }
  return (
    <ApplicationDetailCard
      applicationId={Number(params.applicationId)}
      hackathonId={Number(params.hackathonId)}
    />
  );
};

export default ApplicationDetailPage;
