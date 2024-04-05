"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type DeleteJudgingSlotInput = {
  judgingSlotId: number;
};
const deleteJudgingSlot = async ({ judgingSlotId }: DeleteJudgingSlotInput) => {
  await requireAdminSession();

  const { hackathonId } = await prisma.judgingSlot.delete({
    where: {
      id: judgingSlotId,
    },
    select: {
      hackathonId: true,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/settings`, "page");
};

export default deleteJudgingSlot;
