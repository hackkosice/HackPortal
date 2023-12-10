"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Stack } from "@/components/ui/stack";
import fixFormFieldPositions from "@/server/actions/dashboard/applicationFormEditor/fixFormFieldPositions";
import TravelReimbursementRequestDescriptionDialog from "@/scenes/Dashboard/scenes/Settings/components/TravelReimbursementRequestDescriptionDialog";
import MarkDownRenderer from "@/components/common/MarkDownRenderer";
import { Heading } from "@/components/ui/heading";

type SettingsProps = {
  hackathonId: number;
  travelReimbursementRequestDescription: string | null;
};

const Settings = ({
  hackathonId,
  travelReimbursementRequestDescription,
}: SettingsProps) => {
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
          <Heading size="small">
            Travel reimbursement request description
          </Heading>
          {travelReimbursementRequestDescription && (
            <MarkDownRenderer
              markdown={travelReimbursementRequestDescription}
            />
          )}
          <TravelReimbursementRequestDescriptionDialog
            initialDescription={travelReimbursementRequestDescription}
            hackathonId={hackathonId}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Settings;
