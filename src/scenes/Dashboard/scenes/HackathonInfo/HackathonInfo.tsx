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
  const {
    name,
    description,
    title,
    applicationStartDate,
    applicationEndDate,
    eventStartDate,
    eventEndDate,
  } = await getHackathonInfo(hackathonId);
  return (
    <Card className="md:w-[70vw] mx-auto">
      <CardHeader>
        <CardTitle className="font-semibold text-3xl">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack direction="column">
          <Text className="font-bold">Landing page properties:</Text>
          {title && <Text>{title}</Text>}
          {description && <MarkDownRenderer markdown={description} />}
          <Text className="font-bold">Important dates:</Text>
          <Text>Start date: {eventStartDate.toLocaleDateString("sk-SK")}</Text>
          <Text>End date: {eventEndDate.toLocaleDateString("sk-SK")}</Text>
          <Text>
            Application start date:{" "}
            {applicationStartDate.toLocaleDateString("sk-SK")}
          </Text>
          <Text>
            Application end date:{" "}
            {applicationEndDate.toLocaleDateString("sk-SK")}
          </Text>
          <NewHackathonDialog
            mode="edit"
            hackathonId={hackathonId}
            initialData={{
              name: name,
              title: title ?? "",
              description: description ?? "",
              eventStartDate: eventStartDate,
              eventEndDate: eventEndDate,
              applicationStartDate: applicationStartDate,
              applicationEndDate: applicationEndDate,
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HackathonInfo;
