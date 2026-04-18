"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type DeleteExternalJudgeInput = {
  externalJudgeId: number;
};

const deleteExternalJudge = async ({
  externalJudgeId,
}: DeleteExternalJudgeInput) => {
  await requireAdminSession();

  const judge = await prisma.externalJudge.delete({
    where: { id: externalJudgeId },
    select: { hackathonId: true },
  });

  revalidatePath(`/dashboard/${judge.hackathonId}/judging/overview`, "page");
};

export default deleteExternalJudge;
