import React from "react";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import { Metadata } from "next";
import ApplicationDetailCard from "@/scenes/Dashboard/scenes/ApplicationDetail/ApplicationDetailCard";

export const metadata: Metadata = {
  title: "Application detail",
};

const ApplicationDetailPage = async ({
  params,
}: {
  params: { applicationId: string; hackathonId: string };
}) => {
  await requireOrganizerApp();
  return (
    <ApplicationDetailCard
      applicationId={Number(params.applicationId)}
      hackathonId={Number(params.hackathonId)}
    />
  );
};

export default ApplicationDetailPage;
