import getConfirmedTeams from "@/server/getters/dashboard/tables/getConfirmedTeams";
import { prisma } from "@/services/prisma";

export type TeamForResult = {
  id: number;
  name: string;
  score: number;
};

type ParsedVerdict = Record<string, number>;

type TeamsWithJudgings = {
  teamId: number;
  teamName: string;
  judgingVerdicts: ParsedVerdict[];
}[];

const computeJudgingResults = (
  teamsWithJudgings: TeamsWithJudgings
): TeamForResult[] => {
  // TODO: Implement this function
  return teamsWithJudgings.map((team) => ({
    id: team.teamId,
    name: team.teamName,
    score: 0,
  }));
};

const parseJudgingVerdict = (
  judgingVerdict: string
): Record<string, number> => {
  const values = judgingVerdict.split(";").map((value) => value.split("-"));
  const parsedVerdict = {} as Record<string, number>;
  for (const [key, value] of values) {
    parsedVerdict[key] = Number(value);
  }

  return parsedVerdict;
};
const getJudgingResults = async (
  hackathonId: number
): Promise<TeamForResult[]> => {
  const { fullyConfirmedTeams } = await getConfirmedTeams(hackathonId);
  const teamJudgings = await prisma.teamJudging.findMany({
    select: {
      judgingVerdict: true,
      team: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const teamsWithJudgings: TeamsWithJudgings = [];

  for (const team of fullyConfirmedTeams) {
    const judgings = teamJudgings.filter(
      (teamJudging) => teamJudging.team.id === team.id
    );

    teamsWithJudgings.push({
      teamId: team.id,
      teamName: team.name,
      judgingVerdicts: judgings
        .map((judging) =>
          judging.judgingVerdict
            ? parseJudgingVerdict(judging.judgingVerdict)
            : null
        )
        .filter((judging) => judging !== null) as ParsedVerdict[],
    });
  }

  return computeJudgingResults(teamsWithJudgings);
};

export default getJudgingResults;
