import React from "react";
import { Heading } from "@/components/Heading";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/Text";
import { trpc } from "@/services/trpc";
import { Stack } from "@/components/Stack";
import Link from "next/link";

export type Props = {
  applicationId: number;
};

const ApplicationDetail = ({ applicationId }: Props) => {
  const { data } = trpc.applicationInfo.useQuery({ id: applicationId });
  return (
    <Card>
      <Stack direction="column">
        <Heading>Application detail</Heading>
        <Stack direction="column" spacing="small">
          {data &&
            Object.keys(data.data.values).map((key) => (
              <Text key={key}>
                <span className="font-bold mr-1">{key}:</span>
                {data.data.values[key]}
              </Text>
            ))}
        </Stack>
        <Button asChild size="small" variant="outline">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </Stack>
    </Card>
  );
};

export default ApplicationDetail;
