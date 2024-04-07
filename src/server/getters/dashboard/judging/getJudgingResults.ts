import getConfirmedTeams from "@/server/getters/dashboard/tables/getConfirmedTeams";
import { prisma } from "@/services/prisma";

export type TeamForResult = {
  id: number;
  name: string;
  tableCode: string;
  score: number;
};

type ParsedVerdict = Record<string, number>;

type TeamsWithJudgings = {
  teamId: number;
  teamName: string;
  tableCode: string;
  judgingVerdicts: {
    judgingSlotStartTime: Date;
    organizerId: number;
    verdict: ParsedVerdict;
  }[];
}[];

const computeJudgingResults = (
  teamsWithJudgings: TeamsWithJudgings
): TeamForResult[] => {
  // Define the time equal to 12:45:00
  // Hack Kosice 2024 specific time, used to split the teams into two groups
  // The comparisons will only work if the judging slots are in the same day,
  // that is they need to be created on the day of the judging
  const timeThreshold = new Date();
  timeThreshold.setHours(12);
  timeThreshold.setMinutes(50);
  timeThreshold.setSeconds(0);
  timeThreshold.setMilliseconds(0);

  // Filter the teams with the judgingSlotStartTimes lower that timeThreshold
  // if one time is lower than the threshold, we assume all are and the team
  // is placed in the first group
  const firtsGroup = teamsWithJudgings.filter(
    (team) =>
      (team.judgingVerdicts[0] == undefined
        ? Infinity // Teams without any judgings are discarded
        : team.judgingVerdicts[0].judgingSlotStartTime.getTime()) <
      timeThreshold.getTime()
  );

  // The rest is considered the second group
  const secondGroup = teamsWithJudgings.filter(
    (team) =>
      (team.judgingVerdicts[0] == undefined
        ? 0 // Teams without any judgings are discarded
        : team.judgingVerdicts[0].judgingSlotStartTime.getTime()) >=
      timeThreshold.getTime()
  );

  return processOneGroup(firtsGroup).concat(processOneGroup(secondGroup));
};

const processOneGroup = (
  teamsWithJudgings: TeamsWithJudgings
): TeamForResult[] => {
  // Define a dictionary of teams and their final scores
  const teamScores: Record<number, number> = {};

  // Create a set of all organizer ids
  const organizerIds = new Set(
    teamsWithJudgings.flatMap((team) =>
      team.judgingVerdicts.map((judging) => judging.organizerId)
    )
  );

  organizerIds.forEach((organizerId) => {
    // Calculate the number of verdicts made by this organizer
    const numberOfVerdicts = teamsWithJudgings.reduce((acc, team) => {
      return (
        acc +
        team.judgingVerdicts.filter(
          (judging) => judging.organizerId === organizerId
        ).length
      );
    }, 0);

    // Count the total number of points awarded by the organizer in the verdicts
    const totalPoints = teamsWithJudgings.reduce((acc, team) => {
      return (
        acc +
        team.judgingVerdicts
          .filter((judging) => judging.organizerId === organizerId)
          .reduce((acc, judging) => {
            return (
              acc +
              Object.values(judging.verdict).reduce(
                (acc, value) => acc + value,
                0
              )
            );
          }, 0)
      );
    }, 0);

    // For each team, calculate the proportion of the score given by the particular organizer
    // multiplied by the number of their verdicts and add it to the team's score
    teamsWithJudgings.forEach((team) => {
      const points = team.judgingVerdicts
        .filter((judging) => judging.organizerId === organizerId)
        .reduce((acc, judging) => {
          return (
            acc +
            Object.values(judging.verdict).reduce(
              (acc, value) => acc + value,
              0
            )
          );
        }, 0);

      if (points === 0) {
        return;
      }

      if (!teamScores[team.teamId]) {
        teamScores[team.teamId] = 0;
      }

      teamScores[team.teamId] += (points / totalPoints) * numberOfVerdicts;
    });
  });

  return teamsWithJudgings.map((team) => ({
    id: team.teamId,
    name: team.teamName,
    tableCode: team.tableCode,
    score: teamScores[team.teamId] || 0,
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
      judgingSlot: {
        select: {
          startTime: true,
        },
      },
      judgingVerdict: true,
      team: {
        select: {
          id: true,
          name: true,
          table: {
            select: {
              code: true,
            },
          },
        },
      },
      organizerId: true,
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
      tableCode: team.tableCode || "",
      judgingVerdicts: judgings
        .map((judging) => {
          if (!judging.judgingVerdict) {
            return null;
          }
          const parsedVerdict = parseJudgingVerdict(judging.judgingVerdict);
          return {
            judgingSlotStartTime: judging.judgingSlot.startTime,
            organizerId: judging.organizerId,
            verdict: parsedVerdict,
          };
        })
        .filter((judging) => judging !== null) as {
        judgingSlotStartTime: Date;
        organizerId: number;
        verdict: ParsedVerdict;
      }[],
    });
  }

  return computeJudgingResults(teamsWithJudgings);
};

export default getJudgingResults;
