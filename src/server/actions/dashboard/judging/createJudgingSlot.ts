"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type CreateJudgingSlotInput = {
  startTime: Date;
  endTime: Date;
  hackathonId: number;
};
const createJudgingSlot = async ({
  startTime,
  endTime,
  hackathonId,
}: CreateJudgingSlotInput) => {
  await requireAdminSession();

  await prisma.judgingSlot.create({
    data: {
      startTime,
      endTime,
      hackathonId,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/settings`, "page");
};

export default createJudgingSlot;
