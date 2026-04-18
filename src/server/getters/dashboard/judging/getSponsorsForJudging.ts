import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { prisma } from "@/services/prisma";

export type SponsorForJudging = {
  id: number;
  nameAndCompany: string;
};

const getSponsorsForJudging = async (
  hackathonId: number
): Promise<SponsorForJudging[]> => {
  await requireAdminSession();

  const sponsors = await prisma.sponsor.findMany({
    where: { hackathonId },
    select: {
      id: true,
      company: true,
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { company: "asc" },
  });

  return sponsors.map((sponsor) => ({
    id: sponsor.id,
    nameAndCompany: `${sponsor.company} (${sponsor.user.name || sponsor.user.email})`,
  }));
};

export default getSponsorsForJudging;
