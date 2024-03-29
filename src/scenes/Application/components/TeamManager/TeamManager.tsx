import React from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import getTeam from "@/server/getters/application/team";
import NewTeamDialog from "@/scenes/Application/components/TeamManager/components/NewTeamDialog";
import TeamInfo from "@/scenes/Application/components/TeamManager/components/TeamInfo";
import JoinTeamDialog from "@/scenes/Application/components/TeamManager/components/JoinTeamDialog";
import { Stack } from "@/components/ui/stack";
import { Card } from "@/components/ui/card";
import { UsersIcon } from "@heroicons/react/24/outline";

type TeamManagerProps = {
  hackerId: number | null;
};
const TeamManager = async ({ hackerId }: TeamManagerProps) => {
  const teamData = await getTeam({
    hackerId,
  });
  let teamPageContent = null;
  const { status, team } = teamData;
  if (team === null) {
    teamPageContent = (
      <>
        <Text>
          It is always more fun to join the hackathon as a team! Below you can
          create your own team or join an existing team with your friends.
        </Text>
        <Stack direction="row" justify="around" className="">
          <NewTeamDialog
            isSignedIn={status !== "not_signed_in"}
            hasEmailVerified={status === "success"}
          />
          <JoinTeamDialog
            isSignedIn={status !== "not_signed_in"}
            hasEmailVerified={status === "success"}
          />
        </Stack>
      </>
    );
  } else {
    teamPageContent = (
      <TeamInfo
        team={team}
        isOwnerSession={teamData.isOwnerSession}
        maxTeamSize={teamData.maxTeamSize}
      />
    );
  }

  return (
    <Card className="w-full p-5 relative pt-10">
      <UsersIcon className="text-primaryTitle w-[80px] h-[80px] absolute opacity-20 top-[-40px] left-1/2 -translate-x-1/2" />
      <Heading size="medium" className="text-center">
        Your team
      </Heading>
      <Stack direction="column" alignItems="center" className="mt-5 gap-8">
        {teamPageContent}
      </Stack>
    </Card>
  );
};

export default TeamManager;
