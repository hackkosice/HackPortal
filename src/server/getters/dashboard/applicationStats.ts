import { prisma } from "@/services/prisma";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";

export type ApplicationStatsTotal = {
  total: number;
  changeFromLastWeek: number;
};

type ApplicationStatsData = {
  totalOpenApplications: ApplicationStatsTotal;
  totalSubmittedApplications: ApplicationStatsTotal;
  totalConfirmedApplications: ApplicationStatsTotal;
  totalAttendedApplications: ApplicationStatsTotal;
};

const calculateChangeFromLastWeek = (totals: {
  total: number;
  totalLastWeek: number;
}): ApplicationStatsTotal => {
  if (totals.total === 0) {
    return {
      total: 0,
      changeFromLastWeek: 0,
    };
  }
  if (totals.totalLastWeek === 0) {
    return {
      total: totals.total,
      changeFromLastWeek: 100,
    };
  }
  const change = totals.total - totals.totalLastWeek;
  return {
    total: totals.total,
    changeFromLastWeek: (change / totals.totalLastWeek) * 100,
  };
};
const getApplicationStats = async (
  hackathonId: number
): Promise<ApplicationStatsData> => {
  const applications = await prisma.application.findMany({
    select: {
      id: true,
      status: {
        select: {
          name: true,
        },
      },
      createdAt: true,
    },
    where: {
      hacker: {
        hackathonId,
      },
    },
  });

  const totalOpenApplications = {
    total: 0,
    totalLastWeek: 0,
  };
  const totalSubmittedApplications = {
    total: 0,
    totalLastWeek: 0,
  };
  const totalConfirmedApplications = {
    total: 0,
    totalLastWeek: 0,
  };
  const totalAttendedApplications = {
    total: 0,
    totalLastWeek: 0,
  };

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  for (const application of applications) {
    if (application.status.name === ApplicationStatusEnum.open) {
      totalOpenApplications.total++;
      if (application.createdAt <= lastWeek) {
        totalOpenApplications.totalLastWeek++;
      }
    }
    if (application.status.name === ApplicationStatusEnum.submitted) {
      totalSubmittedApplications.total++;
      if (application.createdAt <= lastWeek) {
        totalSubmittedApplications.totalLastWeek++;
      }
    }
    if (application.status.name === ApplicationStatusEnum.confirmed) {
      totalConfirmedApplications.total++;
      if (application.createdAt <= lastWeek) {
        totalConfirmedApplications.totalLastWeek++;
      }
    }
    if (application.status.name === ApplicationStatusEnum.attended) {
      totalAttendedApplications.total++;
      if (application.createdAt <= lastWeek) {
        totalAttendedApplications.totalLastWeek++;
      }
    }
  }

  return {
    totalOpenApplications: calculateChangeFromLastWeek(totalOpenApplications),
    totalSubmittedApplications: calculateChangeFromLastWeek(
      totalSubmittedApplications
    ),
    totalConfirmedApplications: calculateChangeFromLastWeek(
      totalConfirmedApplications
    ),
    totalAttendedApplications: calculateChangeFromLastWeek(
      totalAttendedApplications
    ),
  };
};

export default getApplicationStats;
