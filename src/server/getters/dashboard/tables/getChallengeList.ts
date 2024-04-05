import { prisma } from "@/services/prisma";

export type Challenge = {
  title: string;
  id: number;
};

type ChallengeList = {
  challenges: Challenge[];
};

const getChallengeList = async (
  hackathonId: number
): Promise<ChallengeList> => {
  const challenges = await prisma.challenge.findMany({
    select: {
      id: true,
      title: true,
      sponsor: {
        select: {
          company: true,
        },
      },
    },
    where: {
      sponsor: {
        hackathonId,
      },
    },
  });

  return {
    challenges: challenges.map((challenge) => ({
      id: challenge.id,
      title: `${challenge.sponsor.company} - ${challenge.title}`,
    })),
  };
};

export default getChallengeList;
