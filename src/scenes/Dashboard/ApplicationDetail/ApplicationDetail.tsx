import React from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Stack } from "@/components/ui/stack";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApplicationDetailData } from "@/server/getters/dashboard/applicationDetail";

export type Props = {
  applicationDetail: ApplicationDetailData;
};

const ApplicationDetail = ({ applicationDetail }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application detail</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack direction="column" spacing="small">
          {Object.keys(applicationDetail.values).map((key) => (
            <Text key={key}>
              <span className="font-bold mr-1">{key}:</span>
              {applicationDetail.values[key]}
            </Text>
          ))}
        </Stack>
      </CardContent>
      <CardFooter>
        <Button asChild size="small" variant="outline">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApplicationDetail;
