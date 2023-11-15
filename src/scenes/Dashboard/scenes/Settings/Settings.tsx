"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Stack } from "@/components/ui/stack";
import fixFormFieldPositions from "@/server/actions/dashboard/applicationFormEditor/fixFormFieldPositions";

type SettingsProps = {
  hackathonId: number;
};

const Settings = ({ hackathonId }: SettingsProps) => {
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <Stack direction="column">
          <Button asChild>
            <Link href="/option-lists">Manage option lists</Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/${hackathonId}/settings/vote-parameters`}>
              Manage vote parameters
            </Link>
          </Button>
          <Button onClick={async () => await fixFormFieldPositions()}>
            Fix form fields
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Settings;
