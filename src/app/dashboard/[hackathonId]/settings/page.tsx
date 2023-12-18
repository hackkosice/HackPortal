import Settings from "@/scenes/Dashboard/scenes/Settings/Settings";
import getTravelReimbursementRequestDescription from "@/server/getters/dashboard/travelReimbursements/travelReimbursementRequestDescription";
import requireAdmin from "@/services/helpers/requireAdmin";
import getAdminInfo from "@/server/getters/dashboard/settings/adminInfo";
import getMaxTeamSize from "@/server/getters/dashboard/settings/maxTeamSize";

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
  const maxTeamSize = await getMaxTeamSize(Number(hackathonId));
  return (
    <Settings
      hackathonId={Number(hackathonId)}
      travelReimbursementRequestDescription={description}
      adminInfo={adminInfo}
      maxTeamSize={maxTeamSize}
    />
  );
};

export default SettingsPage;
