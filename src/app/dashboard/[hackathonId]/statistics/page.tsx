import Statistics from "@/scenes/Dashboard/scenes/Statistics/Statistics";
import requireAdmin from "@/services/helpers/requireAdmin";
import { disallowVolunteer } from "@/services/helpers/disallowVolunteer";
import getApplicationStatistics from "@/server/getters/dashboard/statistics/getApplicationStatistics";

const StatisticsPage = async ({
  params: { hackathonId },
}: {
  params: {
    hackathonId: string;
  };
}) => {
  await disallowVolunteer(hackathonId);
  await requireAdmin();

  const initialData = await getApplicationStatistics(Number(hackathonId), "all");

  return (
    <Statistics
      initialData={initialData}
      hackathonId={Number(hackathonId)}
    />
  );
};

export default StatisticsPage;
