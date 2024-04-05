import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { prisma } from "@/services/prisma";

type SponsorInfo = {
  id: number;
  company: string;
  email: string;
  challengeTitle?: string;
};

export type GetSponsorsInfoData = {
  sponsors: SponsorInfo[];
};

const getSponsorsInfo = async (hackathonId: number) => {
  await requireAdminSession();

  const sponsors = await prisma.sponsor.findMany({
    where: {
      hackathonId,
    },
    select: {
      id: true,
      company: true,
      user: {
        select: {
          email: true,
        },
      },
      challenge: {
        select: {
          title: true,
        },
      },
    },
  });

  return {
    sponsors: sponsors.map((sponsor) => ({
      id: sponsor.id,
      company: sponsor.company,
      email: sponsor.user.email,
      challengeTitle: sponsor.challenge?.title,
    })),
  };
};

export default getSponsorsInfo;
