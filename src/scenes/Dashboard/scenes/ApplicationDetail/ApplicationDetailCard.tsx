import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ApplicationDetail from "@/scenes/Dashboard/scenes/ApplicationDetail/components/ApplicationDetail";

export type Props = {
  applicationId: number;
  hackathonId: number;
};

const ApplicationDetailCard = async ({ applicationId, hackathonId }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application detail</CardTitle>
      </CardHeader>
      <CardContent>
        <ApplicationDetail applicationId={applicationId} />
      </CardContent>
      <CardFooter>
        <Button asChild size="small" variant="outline">
          <Link href={`/dashboard/${hackathonId}/applications`}>
            Back to applications
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApplicationDetailCard;
