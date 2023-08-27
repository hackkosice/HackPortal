import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import React, { Suspense } from "react";
import { Stack } from "@/components/Stack";
import ApplicationSteps from "@/scenes/Application/components/ApplicationSteps/ApplicationSteps";
import TeamManager from "@/scenes/Application/components/TeamManager/TeamManager";

const Application = () => {
  return (
    <>
      <Card>
        <Stack direction="column">
          <Heading centered>Welcome to Hack Kosice Application portal!</Heading>
          <Suspense fallback={<div>Loading...</div>}>
            <ApplicationSteps />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <TeamManager />
          </Suspense>
        </Stack>
      </Card>
    </>
  );
};

export default Application;
