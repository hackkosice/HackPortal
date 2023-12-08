import Settings from "@/scenes/Dashboard/scenes/Settings/Settings";

export const metadata = {
  title: "Settings",
};

const SettingsPage = ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  return <Settings hackathonId={Number(hackathonId)} />;
};

export default SettingsPage;
