import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Stack } from "@/components/ui/stack";
import TravelReimbursementRequestDescriptionDialog from "@/scenes/Dashboard/scenes/Settings/components/TravelReimbursementRequestDescriptionDialog";
import MarkDownRenderer from "@/components/common/MarkDownRenderer";
import { Heading } from "@/components/ui/heading";
import getAdminInfo, {
  GetAdminInfoData,
} from "@/server/getters/dashboard/settings/adminInfo";
import AdminManager from "@/scenes/Dashboard/scenes/Settings/components/AdminManager";
import HackathonMaxTeamSizeDialog from "@/scenes/Dashboard/scenes/Settings/components/HackathonMaxTeamSizeDialog";
import getSponsorsInfo, {
  GetSponsorsInfoData,
} from "@/server/getters/dashboard/settings/sponsorsInfo";
import SponsorsManager from "@/scenes/Dashboard/scenes/Settings/components/SponsorsManager";
import getTravelReimbursementRequestDescription from "@/server/getters/dashboard/travelReimbursements/travelReimbursementRequestDescription";
import getMaxTeamSize from "@/server/getters/dashboard/settings/maxTeamSize";

type SettingsProps = {
  hackathonId: number;
  travelReimbursementRequestDescription: string | null;
  adminInfo: GetAdminInfoData;
  sponsorsInfo: GetSponsorsInfoData;
  maxTeamSize: number;
};

const Settings = async ({ hackathonId }: SettingsProps) => {
  const { description: travelReimbursementRequestDescription } =
    await getTravelReimbursementRequestDescription(hackathonId);
  const adminInfo = await getAdminInfo();
  const maxTeamSize = await getMaxTeamSize(hackathonId);
  const sponsorsInfo = await getSponsorsInfo(hackathonId);
  return (
    <Card className="md:w-[70vw] mx-auto mb-[200px]">
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
          <HackathonMaxTeamSizeDialog
            initialMaxTeamSize={maxTeamSize}
            hackathonId={hackathonId}
          />
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
          <SponsorsManager
            hackathonId={hackathonId}
            sponsorsInfo={sponsorsInfo}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Settings;
