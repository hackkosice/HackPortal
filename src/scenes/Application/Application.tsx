import React, { Suspense } from "react";
import ApplicationSteps from "@/scenes/Application/components/ApplicationSteps/ApplicationSteps";
import TeamManager from "@/scenes/Application/components/TeamManager/TeamManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stack } from "@/components/ui/stack";

const Application = () => {
  return (
    <Card className="mx-auto mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset w-full md:w-[50vw] mb-20">
      <CardHeader>
        <CardTitle>Welcome to Hack Kosice Application portal!</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack direction="column">
          <Suspense fallback={<div>Loading...</div>}>
            <ApplicationSteps />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <TeamManager />
          </Suspense>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Application;
