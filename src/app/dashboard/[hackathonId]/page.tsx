import HackathonInfo from "@/scenes/Dashboard/scenes/HackathonInfo/HackathonInfo";
import requireAdmin from "@/services/helpers/requireAdmin";

const HackathonDashboardPage = async ({
  params: { hackathonId },
}: {
  params: {
    hackathonId: string;
  };
}) => {
  await requireAdmin();
  return <HackathonInfo hackathonId={Number(hackathonId)} />;
};

export default HackathonDashboardPage;
