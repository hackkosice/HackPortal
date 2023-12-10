import Settings from "@/scenes/Dashboard/scenes/Settings/Settings";
import getTravelReimbursementRequestDescription from "@/server/getters/dashboard/travelReimbursements/travelReimbursementRequestDescription";

export const metadata = {
  title: "Settings",
};

const SettingsPage = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  const { description } = await getTravelReimbursementRequestDescription(
    Number(hackathonId)
  );
  return (
    <Settings
      hackathonId={Number(hackathonId)}
      travelReimbursementRequestDescription={description}
    />
  );
};

export default SettingsPage;
