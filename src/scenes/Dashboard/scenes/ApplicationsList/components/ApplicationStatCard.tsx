import React from "react";
import { ApplicationStatsTotal } from "@/server/getters/dashboard/applicationStats";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

type ApplicationStatCardProps = {
  title: string;
  stats: ApplicationStatsTotal;
};
const ApplicationStatCard = ({ title, stats }: ApplicationStatCardProps) => {
  return (
    <div className="border-2 px-5 py-4 rounded-lg">
      <Stack direction="column" className="gap-0">
        <Text className="text-sm">{title}</Text>
        <Text className="font-bold text-[2rem]">{stats.total}</Text>
        <Text className="text-xs">
          +{stats.changeFromLastWeek.toFixed(2)}% from last week
        </Text>
      </Stack>
    </div>
  );
};

export default ApplicationStatCard;
