"use client";

import React from "react";
import { GetSponsorsInfoData } from "@/server/getters/dashboard/settings/sponsorsInfo";
import { Heading } from "@/components/ui/heading";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import AddNewSponsorDialog from "@/scenes/Dashboard/scenes/Settings/components/AddNewSponsorDialog";
import CreateSponsorChallengeDialog from "@/scenes/Dashboard/scenes/Settings/components/CreateSponsorChallenge";

type SponsorsManagerProps = {
  hackathonId: number;
  sponsorsInfo: GetSponsorsInfoData;
};
const SponsorsManager = ({
  hackathonId,
  sponsorsInfo,
}: SponsorsManagerProps) => {
  return (
    <Stack direction="column">
      <Heading size="small">Manage sponsor accounts</Heading>
      <Stack direction="column">
        <Heading size="small">Current sponsors</Heading>
        <Stack direction="column">
          {sponsorsInfo.sponsors.map((sponsor) => (
            <Stack direction="row" key={sponsor.email} alignItems="center">
              <Text size="small">{sponsor.company}</Text>
              <Text size="small">{sponsor.email}</Text>
              {sponsor.challengeTitle ? (
                <Text size="small">{sponsor.challengeTitle}</Text>
              ) : (
                <CreateSponsorChallengeDialog sponsorId={sponsor.id} />
              )}
            </Stack>
          ))}
        </Stack>
        <AddNewSponsorDialog hackathonId={hackathonId} />
      </Stack>
    </Stack>
  );
};

export default SponsorsManager;
