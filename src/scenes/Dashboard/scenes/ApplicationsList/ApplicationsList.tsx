import React from "react";
import ApplicationsTable from "@/scenes/Dashboard/scenes/ApplicationFormEditor/components/ApplicationsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ApplicationsListProps = {
  hackathonId: number;
};
const ApplicationsList = async ({ hackathonId }: ApplicationsListProps) => {
  return (
    <>
      <Button asChild>
        <Link href={`/dashboard/${hackathonId}/applications/review`}>
          Review applications
        </Link>
      </Button>
      <ApplicationsTable hackathonId={hackathonId} />
    </>
  );
};

export default ApplicationsList;
