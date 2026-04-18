"use server";

import { prisma } from "@/services/prisma";

type AddVerdictToExternalTeamJudgingInput = {
  externalTeamJudgingId: number;
  accessToken: string;
  judgingVerdict: string;
};

const addVerdictToExternalTeamJudging = async ({
  externalTeamJudgingId,
  accessToken,
  judgingVerdict,
}: AddVerdictToExternalTeamJudgingInput) => {
  const record = await prisma.externalTeamJudging.findUnique({
    where: { id: externalTeamJudgingId },
    select: {
      externalJudge: { select: { accessToken: true } },
    },
  });

  if (!record) {
    throw new Error("External team judging not found");
  }

  if (record.externalJudge.accessToken !== accessToken) {
    throw new Error("Invalid access token");
  }

  await prisma.externalTeamJudging.update({
    where: { id: externalTeamJudgingId },
    data: { judgingVerdict },
  });
};

export default addVerdictToExternalTeamJudging;
