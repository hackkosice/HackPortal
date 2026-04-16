import { notFound } from "next/navigation";
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
  const hackathonIdNum = Number(hackathonId);
  if (isNaN(hackathonIdNum)) {
    notFound();
  }

  await disallowVolunteer(hackathonId);
  await requireAdmin();

  const initialData = await getApplicationStatistics(hackathonIdNum, "all");

  return (
    <Statistics initialData={initialData} hackathonId={hackathonIdNum} />
  );
};

export default StatisticsPage;
