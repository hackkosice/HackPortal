import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import getApplicationDetailForSponsors from "@/server/getters/sponsors/getApplicationDetailForSponsors";
import ApplicationDetailProperties from "@/scenes/Dashboard/scenes/ApplicationDetail/components/ApplicationDetailProperties";
import Link from "next/link";
import { Stack } from "@/components/ui/stack";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

type SponsorsApplicationDetailProps = {
  applicationId: number;
  hackathonId: number;
};
const SponsorsApplicationDetail = async ({
  applicationId,
  hackathonId,
}: SponsorsApplicationDetailProps) => {
  const applicationDetail = await getApplicationDetailForSponsors(
    applicationId
  );
  return (
    <div className="mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset w-full">
      <Stack direction="column" className="md:w-[70vw] mx-auto mb-20">
        <Link
          href={`/sponsors/${hackathonId}/applications`}
          className="text-hkOrange"
        >
          <Stack direction="row" alignItems="center" spacing="small">
            <ChevronLeftIcon className="h-5 w-5" />
            Back to applications
          </Stack>
        </Link>
        <Card className="mx-auto w-full">
          <CardHeader>
            <CardTitle>Sponsor Portal</CardTitle>
            <ApplicationDetailProperties
              shownProperties={applicationDetail.shownProperties}
              hiddenPropertiesValues={applicationDetail.hiddenPropertiesValues}
            />
          </CardHeader>
        </Card>
      </Stack>
    </div>
  );
};

export default SponsorsApplicationDetail;
