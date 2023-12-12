"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Stack } from "@/components/ui/stack";
import TravelReimbursementRequestDescriptionDialog from "@/scenes/Dashboard/scenes/Settings/components/TravelReimbursementRequestDescriptionDialog";
import MarkDownRenderer from "@/components/common/MarkDownRenderer";
import { Heading } from "@/components/ui/heading";
import { GetAdminInfoData } from "@/server/getters/dashboard/settings/adminInfo";
import AdminManager from "@/scenes/Dashboard/scenes/Settings/components/AdminManager";

type SettingsProps = {
  hackathonId: number;
  travelReimbursementRequestDescription: string | null;
  adminInfo: GetAdminInfoData;
};

const Settings = ({
  hackathonId,
  travelReimbursementRequestDescription,
  adminInfo,
}: SettingsProps) => {
  return (
    <Card className="md:w-[70vw] mx-auto">
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
          <AdminManager adminInfo={adminInfo} hackathonId={hackathonId} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Settings;
