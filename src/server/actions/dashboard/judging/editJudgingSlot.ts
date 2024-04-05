"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type EditJudgingSlotInput = {
  judgingSlotId: number;
  startTime: Date;
  endTime: Date;
};
const editJudgingSlot = async ({
  judgingSlotId,
  startTime,
  endTime,
}: EditJudgingSlotInput) => {
  await requireAdminSession();

  const { hackathonId } = await prisma.judgingSlot.update({
    where: {
      id: judgingSlotId,
    },
    data: {
      startTime,
      endTime,
    },
    select: {
      hackathonId: true,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/settings`, "page");
};

export default editJudgingSlot;
