import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import getTeam from "@/server/getters/team";

const TeamManager = async () => {
  const { data } = await getTeam();
  return (
    <>
      <Heading size="small">Your team</Heading>
      {data.team ? (
        <Text>Team name: {data.team.name}</Text>
      ) : (
        <Text>You are not in a team</Text>
      )}
    </>
  );
};

export default TeamManager;
