import React from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/Text";
import { trpc } from "@/services/trpc";
import { Stack } from "@/components/Stack";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type Props = {
  applicationId: number;
};

const ApplicationDetail = ({ applicationId }: Props) => {
  const { data } = trpc.applicationInfo.useQuery({ id: applicationId });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application detail</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack direction="column" spacing="small">
          {data &&
            Object.keys(data.data.values).map((key) => (
              <Text key={key}>
                <span className="font-bold mr-1">{key}:</span>
                {data.data.values[key]}
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
