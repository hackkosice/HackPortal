import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import getConfirmedTeams from "@/server/getters/dashboard/tables/getConfirmedTeams";

export type TeamForJudging = {
  nameAndTable: string;
  teamId: number;
};

const getTeamsForJudging = async (
  hackathonId: number
): Promise<TeamForJudging[]> => {
  await requireAdminSession();

  const { fullyConfirmedTeams } = await getConfirmedTeams(hackathonId);

  return fullyConfirmedTeams.map((team) => ({
    nameAndTable: `${team.name}${team.tableCode ? ` (${team.tableCode})` : ""}`,
    teamId: team.id,
  }));
};

export default getTeamsForJudging;
