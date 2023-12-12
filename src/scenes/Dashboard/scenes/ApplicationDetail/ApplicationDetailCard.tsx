import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationDetail from "@/scenes/Dashboard/scenes/ApplicationDetail/components/ApplicationDetail";
import { Stack } from "@/components/ui/stack";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export type Props = {
  applicationId: number;
  hackathonId: number;
};

const ApplicationDetailCard = async ({ applicationId, hackathonId }: Props) => {
  return (
    <Stack direction="column" className="md:w-[60vw] mx-auto mb-20">
      <Link
        href={`/dashboard/${hackathonId}/applications`}
        className="text-hkOrange"
      >
        <Stack direction="row" alignItems="center" spacing="small">
          <ChevronLeftIcon className="h-5 w-5" />
          Back to applications
        </Stack>
      </Link>
      <Card className="md:w-[60vw] px-5 py-3">
        <CardHeader>
          <CardTitle>Application detail</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationDetail applicationId={applicationId} />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ApplicationDetailCard;
