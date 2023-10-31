import { prisma } from "@/services/prisma";

type VoteParameter = {
  name: string;
  description: string | null;
  weight: number;
  minValue: number;
  maxValue: number;
};

type VoteParametersData = VoteParameter[];
const getVoteParameters = (
  hackathonId: number
): Promise<VoteParametersData> => {
  return prisma.voteParameter.findMany({
    where: {
      hackathonId,
    },
    select: {
      name: true,
      description: true,
      weight: true,
      minValue: true,
      maxValue: true,
    },
  });
};
