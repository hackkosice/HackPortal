import React from "react";
import requireOrganizer from "@/services/helpers/requireOrganizer";
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
  await requireOrganizer();
  return (
    <ApplicationDetailCard
      applicationId={Number(params.applicationId)}
      hackathonId={Number(params.hackathonId)}
    />
  );
};

export default ApplicationDetailPage;
