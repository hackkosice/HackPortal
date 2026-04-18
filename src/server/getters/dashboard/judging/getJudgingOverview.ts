import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { prisma } from "@/services/prisma";

export type JudgingOverviewSlot = {
  id: number;
  startTime: Date;
  endTime: Date;
};

export type JudgingOverviewAssignment = {
  slotId: number;
  teamJudgingId?: number;
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

export type SponsorJudgingAssignment = {
  slotId: number;
  sponsorJudgingId: number;
  team?: { id: number; name: string; tableCode?: string };
  hasVerdict: boolean;
};

export type JudgingOverviewSponsor = {
  id: number;
  name: string;
  assignments: SponsorJudgingAssignment[];
};

export type ChallengeStats = {
  id: number;
  title: string;
  teamCount: number;
  teams: { name: string; tableCode?: string }[];
};

export type TeamJudgingStats = {
  id: number;
  name: string;
  tableCode?: string;
  assignmentCount: number;
  verdictCount: number;
  sponsorAssignmentCount: number;
  sponsorVerdictCount: number;
  externalAssignmentCount: number;
  externalVerdictCount: number;
};

export type ExternalJudgeOverviewAssignment = {
  slotId: number;
  externalTeamJudgingId: number;
  team?: {
    id: number;
    name: string;
    tableCode?: string;
  };
  hasVerdict: boolean;
};

export type ExternalJudgeOverview = {
  id: number;
  name: string;
  accessToken: string;
  assignments: ExternalJudgeOverviewAssignment[];
};

export type JudgingOverviewData = {
  slots: JudgingOverviewSlot[];
  judges: JudgingOverviewJudge[];
  sponsors: JudgingOverviewSponsor[];
  externalJudges: ExternalJudgeOverview[];
  challengeStats: ChallengeStats[];
  teamStats: TeamJudgingStats[];
};

const getJudgingOverview = async (
  hackathonId: number
): Promise<JudgingOverviewData> => {
  await requireAdminSession();

  const [
    slots,
    organizers,
    challenges,
    teams,
    sponsorJudgings,
    externalJudgesRaw,
  ] = await Promise.all([
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
            id: true,
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
        id: true,
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
    prisma.team.findMany({
      where: {
        members: { some: { hackathonId } },
        table: { hackathonId },
      },
      select: {
        id: true,
        name: true,
        table: { select: { code: true } },
        teamJudgings: {
          where: { judgingSlot: { hackathonId } },
          select: { judgingVerdict: true },
        },
        sponsorJudgings: {
          where: { judgingSlot: { hackathonId } },
          select: { judgingVerdict: true },
        },
        externalTeamJudgings: {
          where: { judgingSlot: { hackathonId } },
          select: { judgingVerdict: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.sponsor.findMany({
      where: { hackathonId },
      select: {
        id: true,
        company: true,
        user: { select: { name: true, email: true } },
        sponsorJudgings: {
          where: { judgingSlot: { hackathonId } },
          select: {
            id: true,
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
      orderBy: { company: "asc" },
    }),
    prisma.externalJudge.findMany({
      where: { hackathonId },
      select: {
        id: true,
        name: true,
        accessToken: true,
        teamJudgings: {
          where: { judgingSlot: { hackathonId } },
          select: {
            id: true,
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
      orderBy: { name: "asc" },
    }),
  ]);

  const judges: JudgingOverviewJudge[] = organizers.map((org) => ({
    id: org.id,
    name: org.user.name || org.user.email,
    assignments: slots.map((slot) => {
      const assignment = org.teamJudgings.find(
        (tj) => tj.judgingSlotId === slot.id
      );
      return {
        slotId: slot.id,
        teamJudgingId: assignment?.id,
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

  // Only include sponsors that have at least one sponsor judging assignment
  const sponsorsWithAssignments = sponsorJudgings.filter(
    (s) => s.sponsorJudgings.length > 0
  );

  const sponsors: JudgingOverviewSponsor[] = sponsorsWithAssignments.map(
    (sponsor) => ({
      id: sponsor.id,
      name: sponsor.company,
      assignments: sponsor.sponsorJudgings.map((sj) => ({
        slotId: sj.judgingSlotId,
        sponsorJudgingId: sj.id,
        team: sj.team
          ? {
              id: sj.team.id,
              name: sj.team.name,
              tableCode: sj.team.table?.code,
            }
          : undefined,
        hasVerdict: !!sj.judgingVerdict,
      })),
    })
  );

  const challengeStats: ChallengeStats[] = challenges.map((challenge) => ({
    id: challenge.id,
    title: challenge.title,
    teamCount: challenge.teams.length,
    teams: challenge.teams.map((team) => ({
      name: team.name,
      tableCode: team.table?.code,
    })),
  }));

  const teamStats: TeamJudgingStats[] = teams.map((team) => ({
    id: team.id,
    name: team.name,
    tableCode: team.table?.code,
    assignmentCount: team.teamJudgings.length,
    verdictCount: team.teamJudgings.filter((tj) => tj.judgingVerdict).length,
    sponsorAssignmentCount: team.sponsorJudgings.length,
    sponsorVerdictCount: team.sponsorJudgings.filter((sj) => sj.judgingVerdict)
      .length,
    externalAssignmentCount: team.externalTeamJudgings.length,
    externalVerdictCount: team.externalTeamJudgings.filter(
      (etj) => etj.judgingVerdict
    ).length,
  }));

  // Only include external judges that have at least one assignment
  const externalJudgesWithAssignments = externalJudgesRaw.filter(
    (ej) => ej.teamJudgings.length > 0
  );

  const externalJudges: ExternalJudgeOverview[] =
    externalJudgesWithAssignments.map((ej) => ({
      id: ej.id,
      name: ej.name,
      accessToken: ej.accessToken,
      assignments: ej.teamJudgings.map((tj) => ({
        slotId: tj.judgingSlotId,
        externalTeamJudgingId: tj.id,
        team: tj.team
          ? {
              id: tj.team.id,
              name: tj.team.name,
              tableCode: tj.team.table?.code,
            }
          : undefined,
        hasVerdict: !!tj.judgingVerdict,
      })),
    }));

  return { slots, judges, sponsors, externalJudges, challengeStats, teamStats };
};

export default getJudgingOverview;
