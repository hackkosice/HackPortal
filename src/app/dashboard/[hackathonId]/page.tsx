import HackathonInfo from "@/scenes/Dashboard/scenes/HackathonInfo/HackathonInfo";
import requireAdmin from "@/services/helpers/requireAdmin";
import { disallowVolunteer } from "@/services/helpers/disallowVolunteer";

const HackathonDashboardPage = async ({
  params: { hackathonId },
}: {
  params: {
    hackathonId: string;
  };
}) => {
  await disallowVolunteer(hackathonId);
  await requireAdmin();
  return <HackathonInfo hackathonId={Number(hackathonId)} />;
};

export default HackathonDashboardPage;
