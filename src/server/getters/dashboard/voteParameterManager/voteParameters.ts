import { prisma } from "@/services/prisma";

export type VoteParameter = {
  id: number;
  name: string;
  description: string | null;
  weight: number;
  minValue: number;
  maxValue: number;
};

export type VoteParametersData = VoteParameter[];
const getVoteParameters = (
  hackathonId: number
): Promise<VoteParametersData> => {
  return prisma.voteParameter.findMany({
    where: {
      hackathonId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      weight: true,
      minValue: true,
      maxValue: true,
    },
  });
};

export default getVoteParameters;
