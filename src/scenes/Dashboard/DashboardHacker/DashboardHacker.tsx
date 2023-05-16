import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { trpc } from "@/services/trpc";
import React from "react";
import Link from "next/link";

const DashboardHacker = () => {
  const { data: dataSteps } = trpc.stepsHacker.useQuery();
  const { data: dataApplication } = trpc.application.useQuery();
  return (
    <Card>
      <Heading spaceAfter="large" centered>
        Welcome to Hack Kosice Application portal!
      </Heading>
      <Text>Application status: {dataApplication?.data.status.name}</Text>
      Complete steps below to finish your application:
      {dataSteps?.data.map((step) => (
        <Link href={`/form/step/${step.id}`} key={step.id}>
          <p className="my-2">
            {step.stepNumber}. {step.title}
          </p>
        </Link>
      ))}
    </Card>
  );
};

export default DashboardHacker;
