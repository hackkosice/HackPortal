import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { prisma } from "@/services/prisma";

export type JudgingOverviewSlot = {
  id: number;
  startTime: Date;
  endTime: Date;
};

export type JudgingOverviewAssignment = {
  slotId: number;
  team?: {
    id: number;
    name: string;
    tableCode?: string;
  };
  hasVerdict: boolean;
};

export type JudgingOverviewJudge = {
  id: number;
  name: string;
  assignments: JudgingOverviewAssignment[];
};

export type ChallengeStats = {
  title: string;
  teamCount: number;
  teams: { name: string; tableCode?: string }[];
};

export type JudgingOverviewData = {
  slots: JudgingOverviewSlot[];
  judges: JudgingOverviewJudge[];
  challengeStats: ChallengeStats[];
};

const getJudgingOverview = async (
  hackathonId: number
): Promise<JudgingOverviewData> => {
  await requireAdminSession();

  const [slots, organizers, challenges] = await Promise.all([
    prisma.judgingSlot.findMany({
      where: { hackathonId },
      orderBy: { startTime: "asc" },
    }),
    prisma.organizer.findMany({
      select: {
        id: true,
        user: { select: { name: true, email: true } },
        teamJudgings: {
          where: { judgingSlot: { hackathonId } },
          select: {
            judgingSlotId: true,
            judgingVerdict: true,
            team: {
              select: {
                id: true,
                name: true,
                table: { select: { code: true } },
              },
            },
          },
        },
      },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.challenge.findMany({
      where: { sponsor: { hackathonId } },
      select: {
        title: true,
        teams: {
          where: {
            members: { some: { hackathonId } },
            table: { hackathonId },
          },
          select: {
            name: true,
            table: { select: { code: true } },
          },
        },
      },
      orderBy: { title: "asc" },
    }),
  ]);

  const judges: JudgingOverviewJudge[] = organizers.map((org) => ({
    id: org.id,
    name: org.user.name ?? org.user.email,
    assignments: slots.map((slot) => {
      const assignment = org.teamJudgings.find(
        (tj) => tj.judgingSlotId === slot.id
      );
      return {
        slotId: slot.id,
        team: assignment?.team
          ? {
              id: assignment.team.id,
              name: assignment.team.name,
              tableCode: assignment.team.table?.code,
            }
          : undefined,
        hasVerdict: !!assignment?.judgingVerdict,
      };
    }),
  }));

  const challengeStats: ChallengeStats[] = challenges.map((challenge) => ({
    title: challenge.title,
    teamCount: challenge.teams.length,
    teams: challenge.teams.map((team) => ({
      name: team.name,
      tableCode: team.table?.code,
    })),
  }));

  return { slots, judges, challengeStats };
};

export default getJudgingOverview;
