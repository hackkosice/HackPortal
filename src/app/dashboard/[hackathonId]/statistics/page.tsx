import React from "react";
import Statistics from "@/scenes/Dashboard/scenes/Statistics/Statistics";
import { disallowVolunteer } from "@/services/helpers/disallowVolunteer";
import getApplicationStatistics from "@/server/getters/dashboard/statistics/getApplicationStatistics";

export const metadata = {
  title: "Statistics",
};

const StatisticsPage = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await disallowVolunteer(hackathonId);
  const initialData = await getApplicationStatistics(Number(hackathonId), "all");

  return (
    <Statistics
      initialData={initialData}
      hackathonId={Number(hackathonId)}
    />
  );
};

export default StatisticsPage;
