import React from "react";
import ApplicationsTable from "@/scenes/Dashboard/scenes/ApplicationFormEditor/components/ApplicationsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getApplicationsList from "@/server/getters/dashboard/applicationList";
import { Stack } from "@/components/ui/stack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ApplicationsListProps = {
  hackathonId: number;
};
const ApplicationsList = async ({ hackathonId }: ApplicationsListProps) => {
  const { applications } = await getApplicationsList(hackathonId);

  return (
    <Card className="w-fit m-auto">
      <CardHeader>
        <CardTitle>Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack direction="column">
          <Button asChild>
            <Link href={`/dashboard/${hackathonId}/applications/review`}>
              Review applications
            </Link>
          </Button>
          <Stack direction="column">
            <ApplicationsTable
              hackathonId={hackathonId}
              applicationValues={applications.map(
                (application) => application.properties
              )}
              applications={applications}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ApplicationsList;
