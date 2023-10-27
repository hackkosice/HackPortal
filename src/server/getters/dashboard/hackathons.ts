import { prisma } from "@/services/prisma";

export type HackathonData = {
  id: number;
  name: string;
  applicationStartDate: Date;
  applicationEndDate: Date;
};
type GetHackathonsData = {
  hackathons: HackathonData[];
  activeHackathon: HackathonData | null;
};

const getHackathons = async (): Promise<GetHackathonsData> => {
  const hackathons = await prisma.hackathon.findMany({
    select: {
      id: true,
      name: true,
      applicationStartDate: true,
      applicationEndDate: true,
    },
    orderBy: {
      eventStartDate: "desc",
    },
  });

  const today = new Date();
  const activeHackathon = hackathons.filter((hackathon) => {
    return (
      hackathon.applicationStartDate < today &&
      hackathon.applicationEndDate > today
    );
  });

  return {
    hackathons,
    activeHackathon: activeHackathon.length > 0 ? activeHackathon[0] : null,
  };
};

export default getHackathons;
