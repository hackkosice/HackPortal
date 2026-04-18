"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type CreateExternalJudgeInput = {
  hackathonId: number;
  name: string;
};

const createExternalJudge = async ({
  hackathonId,
  name,
}: CreateExternalJudgeInput) => {
  await requireAdminSession();

  const accessToken = crypto.randomUUID();

  const judge = await prisma.externalJudge.create({
    data: {
      hackathonId,
      name,
      accessToken,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/judging/overview`, "page");

  return judge;
};

export default createExternalJudge;
