import React, { Suspense } from "react";
import ApplicationSteps from "@/scenes/Application/components/ApplicationSteps/ApplicationSteps";
import TeamManager from "@/scenes/Application/components/TeamManager/TeamManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Application = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Hack Kosice Application portal!</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading...</div>}>
          <ApplicationSteps />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <TeamManager />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default Application;
