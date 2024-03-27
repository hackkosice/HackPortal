import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import getApplicationsForSponsors from "@/server/getters/sponsors/getApplicationsForSponsors";
import SponsorsApplicationsTable from "@/scenes/Sponsors/ApplicationList/components/SponsorsApplicationsTable";
import { Stack } from "@/components/ui/stack";

type SponsorsApplicationListProps = {
  hackathonId: number;
};
const SponsorsApplicationList = async ({
  hackathonId,
}: SponsorsApplicationListProps) => {
  const { applications } = await getApplicationsForSponsors(hackathonId);
  return (
    <Card className="mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset mx-auto">
      <CardHeader>
        <CardTitle>Sponsor Portal</CardTitle>
        <Stack direction="column">
          <SponsorsApplicationsTable
            hackathonId={hackathonId}
            applicationProperties={applications.map(
              (application) => application.properties
            )}
          />
        </Stack>
      </CardHeader>
    </Card>
  );
};

export default SponsorsApplicationList;
