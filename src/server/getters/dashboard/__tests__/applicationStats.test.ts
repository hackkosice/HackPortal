import getApplicationStats from "@/server/getters/dashboard/applicationStats";
import { prismaMock } from "@/services/jest/prisma-singleton";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

describe("getApplicationStats", () => {
  it("should return zeros when there are no applications", async () => {
    prismaMock.application.findMany.mockResolvedValue([]);

    const stats = await getApplicationStats(1);

    expect(stats.totalOpenApplications).toEqual({
      total: 0,
      changeFromLastWeek: 0,
    });
  });

  it("should count applications by status with change from last week", async () => {
    prismaMock.application.findMany.mockResolvedValue([
      { status: { name: ApplicationStatusEnum.open }, createdAt: daysAgo(1) },
      {
        status: { name: ApplicationStatusEnum.submitted },
        createdAt: daysAgo(10),
      },
      {
        status: { name: ApplicationStatusEnum.submitted },
        createdAt: daysAgo(1),
      },
      {
        status: { name: ApplicationStatusEnum.confirmed },
        createdAt: daysAgo(10),
      },
      {
        status: { name: ApplicationStatusEnum.attended },
        createdAt: daysAgo(10),
      },
      {
        status: { name: ApplicationStatusEnum.rejected },
        createdAt: daysAgo(10),
      },
    ] as never);

    const stats = await getApplicationStats(1);

    expect(stats).toEqual({
      totalOpenApplications: { total: 1, changeFromLastWeek: 100 },
      totalSubmittedApplications: { total: 2, changeFromLastWeek: 100 },
      totalConfirmedApplications: { total: 1, changeFromLastWeek: 0 },
      totalAttendedApplications: { total: 1, changeFromLastWeek: 0 },
    });
  });
});
