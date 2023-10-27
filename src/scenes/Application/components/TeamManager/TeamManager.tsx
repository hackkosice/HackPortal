import React from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import getTeam from "@/server/getters/team";
import NewTeamDialog from "@/scenes/Application/components/TeamManager/components/NewTeamDialog";
import TeamInfo from "@/scenes/Application/components/TeamManager/components/TeamInfo";
import JoinTeamDialog from "@/scenes/Application/components/TeamManager/components/JoinTeamDialog";
import { Stack } from "@/components/ui/stack";

const TeamManager = async () => {
  const { status, team, isOwnerSession } = await getTeam();
  if (status === "not_signed_in") {
    return (
      <div>
        <Heading size="small">Your team</Heading>
        <Text>You can create or join teams after you sign in</Text>
      </div>
    );
  }
  if (team === null) {
    return (
      <div>
        <Heading size="small">Your team</Heading>
        <Stack direction="column">
          <Text>You are not in any team</Text>
          <NewTeamDialog />
          <JoinTeamDialog />
        </Stack>
      </div>
    );
  }

  return (
    <div>
      <Heading size="small">Your team</Heading>
      <TeamInfo team={team} isOwnerSession={isOwnerSession} />
    </div>
  );
};

export default TeamManager;
