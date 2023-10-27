import React from "react";
import getHackathonInfo from "@/server/getters/dashboard/hackathonInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

type HackathonInfoProps = {
  hackathonId: number;
};
const HackathonInfo = async ({ hackathonId }: HackathonInfoProps) => {
  const hackathon = await getHackathonInfo(hackathonId);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold text-3xl">
          {hackathon.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Text>Start date: {hackathon.eventStartDate.toDateString()}</Text>
        <Text>End date: {hackathon.eventEndDate.toDateString()}</Text>
      </CardContent>
    </Card>
  );
};

export default HackathonInfo;
