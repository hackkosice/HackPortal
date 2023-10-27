import HackathonInfo from "@/scenes/Dashboard/scenes/HackathonInfo/HackathonInfo";

const HackathonDashboardPage = ({
  params: { hackathonId },
}: {
  params: {
    hackathonId: string;
  };
}) => {
  return <HackathonInfo hackathonId={Number(hackathonId)} />;
};

export default HackathonDashboardPage;
