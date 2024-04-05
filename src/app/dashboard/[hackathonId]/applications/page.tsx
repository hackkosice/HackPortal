import React from "react";
import ApplicationsList from "@/scenes/Dashboard/scenes/ApplicationsList/ApplicationsList";
import { disallowVolunteer } from "@/services/helpers/disallowVolunteer";

export const metadata = {
  title: "Applications",
};
const ApplicationsPage = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await disallowVolunteer(hackathonId);
  return <ApplicationsList hackathonId={Number(hackathonId)} />;
};

export default ApplicationsPage;
