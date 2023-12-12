import Settings from "@/scenes/Dashboard/scenes/Settings/Settings";
import getTravelReimbursementRequestDescription from "@/server/getters/dashboard/travelReimbursements/travelReimbursementRequestDescription";
import requireAdmin from "@/services/helpers/requireAdmin";
import getAdminInfo from "@/server/getters/dashboard/settings/adminInfo";

export const metadata = {
  title: "Settings",
};

const SettingsPage = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await requireAdmin();
  const { description } = await getTravelReimbursementRequestDescription(
    Number(hackathonId)
  );
  const adminInfo = await getAdminInfo();
  return (
    <Settings
      hackathonId={Number(hackathonId)}
      travelReimbursementRequestDescription={description}
      adminInfo={adminInfo}
    />
  );
};

export default SettingsPage;
