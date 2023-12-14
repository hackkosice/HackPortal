import React from "react";
import ApplicationsTable from "@/scenes/Dashboard/scenes/ApplicationsList/components/ApplicationsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getApplicationsList from "@/server/getters/dashboard/applicationList";
import { Stack } from "@/components/ui/stack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getApplicationStats from "@/server/getters/dashboard/applicationStats";
import ApplicationStatCard from "@/scenes/Dashboard/scenes/ApplicationsList/components/ApplicationStatCard";

type ApplicationsListProps = {
  hackathonId: number;
};
const ApplicationsList = async ({ hackathonId }: ApplicationsListProps) => {
  const { applications } = await getApplicationsList(hackathonId);
  const applicationStats = await getApplicationStats(hackathonId);
  return (
    <Card className="w-fit m-auto">
      <CardHeader>
        <CardTitle>Applications</CardTitle>
      </CardHeader>
      <Stack
        direction="row"
        className="flex-wrap w-full justify-around mb-5 lg:px-20"
      >
        <ApplicationStatCard
          title="Total open"
          stats={applicationStats.totalOpenApplications}
        />
        <ApplicationStatCard
          title="Total submitted"
          stats={applicationStats.totalSubmittedApplications}
        />
        <ApplicationStatCard
          title="Total confirmed"
          stats={applicationStats.totalConfirmedApplications}
        />
        <ApplicationStatCard
          title="Total attended"
          stats={applicationStats.totalAttendedApplications}
        />
      </Stack>
      <CardContent>
        <Stack direction="column">
          <Button asChild>
            <Link href={`/dashboard/${hackathonId}/applications/review`}>
              Review applications
            </Link>
          </Button>
          <Stack direction="column">
            {applications.length > 0 ? (
              <ApplicationsTable
                hackathonId={hackathonId}
                applicationProperties={applications.map(
                  (application) => application.properties
                )}
              />
            ) : (
              "No applications yet"
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ApplicationsList;
