import React from "react";
import getHackathonInfo from "@/server/getters/dashboard/hackathonInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import NewHackathonDialog from "@/scenes/Dashboard/components/NewHackathonDialog";
import { Stack } from "@/components/ui/stack";
import MarkDownRenderer from "@/components/common/MarkDownRenderer";

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
        <Stack direction="column">
          <Text>
            <MarkDownRenderer markdown={hackathon.description} />
          </Text>
          <Text>
            Start date: {hackathon.eventStartDate.toLocaleDateString("sk-SK")}
          </Text>
          <Text>
            End date: {hackathon.eventEndDate.toLocaleDateString("sk-SK")}
          </Text>
          <Text>
            Application start date:{" "}
            {hackathon.applicationStartDate.toLocaleDateString("sk-SK")}
          </Text>
          <Text>
            Application end date:{" "}
            {hackathon.applicationEndDate.toLocaleDateString("sk-SK")}
          </Text>
          <NewHackathonDialog
            mode="edit"
            hackathonId={hackathonId}
            initialData={{
              name: hackathon.name,
              description: hackathon.description,
              eventStartDate: hackathon.eventStartDate,
              eventEndDate: hackathon.eventEndDate,
              applicationStartDate: hackathon.applicationStartDate,
              applicationEndDate: hackathon.applicationEndDate,
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HackathonInfo;
