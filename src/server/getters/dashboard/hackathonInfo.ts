"use server";

import { prisma } from "@/services/prisma";

type HackathonInfoData = {
  id: number;
  name: string;
  title?: string;
  description?: string;
  applicationStartDate: Date;
  applicationEndDate: Date;
  eventStartDate: Date;
  eventEndDate: Date;
};
const getHackathonInfo = async (
  hackathonId: number
): Promise<HackathonInfoData> => {
  const hackathon = await prisma.hackathon.findUnique({
    where: {
      id: hackathonId,
    },
  });

  if (!hackathon) {
    throw new Error("Hackathon not found");
  }

  return hackathon;
};

export default getHackathonInfo;
