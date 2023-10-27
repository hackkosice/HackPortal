import React from "react";
import ApplicationsTable from "@/scenes/Dashboard/scenes/ApplicationFormEditor/components/ApplicationsTable";

type ApplicationsListProps = {
  hackathonId: number;
};
const ApplicationsList = async ({ hackathonId }: ApplicationsListProps) => {
  return <ApplicationsTable hackathonId={hackathonId} />;
};

export default ApplicationsList;
