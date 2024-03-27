import Settings from "@/scenes/Dashboard/scenes/Settings/Settings";
import getTravelReimbursementRequestDescription from "@/server/getters/dashboard/travelReimbursements/travelReimbursementRequestDescription";
import requireAdmin from "@/services/helpers/requireAdmin";
import getAdminInfo from "@/server/getters/dashboard/settings/adminInfo";
import getMaxTeamSize from "@/server/getters/dashboard/settings/maxTeamSize";
import getSponsorsInfo from "@/server/getters/dashboard/settings/sponsorsInfo";

export const metadata = {
  title: "Settings",
};

const SettingsPage = async ({
  params,
}: {
  params: { hackathonId: string };
}) => {
  const hackathonId = Number(params.hackathonId);
  await requireAdmin();
  const { description } = await getTravelReimbursementRequestDescription(
    hackathonId
  );
  const adminInfo = await getAdminInfo();
  const maxTeamSize = await getMaxTeamSize(hackathonId);
  const sponsorsInfo = await getSponsorsInfo(hackathonId);
  return (
    <Settings
      hackathonId={hackathonId}
      travelReimbursementRequestDescription={description}
      adminInfo={adminInfo}
      sponsorsInfo={sponsorsInfo}
      maxTeamSize={maxTeamSize}
    />
  );
};

export default SettingsPage;
