import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import getTeam from "@/server/endpoints/team";

const TeamManager = async () => {
  const teamData = await getTeam();
  return (
    <>
      <Heading size="small">Your team</Heading>
      {teamData.data.team ? (
        <Text>Team name: {teamData.data.team.name}</Text>
      ) : (
        <Text>You are not in a team</Text>
      )}
    </>
  );
};

export default TeamManager;
