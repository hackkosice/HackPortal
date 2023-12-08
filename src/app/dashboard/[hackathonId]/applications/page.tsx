import React from "react";
import ApplicationsList from "@/scenes/Dashboard/scenes/ApplicationsList/ApplicationsList";

export const metadata = {
  title: "Applications",
};
const ApplicationsPage = ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  return <ApplicationsList hackathonId={Number(hackathonId)} />;
};

export default ApplicationsPage;
