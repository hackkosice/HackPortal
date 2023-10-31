"use server";

import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

type CreateNewStepInput = {
  hackathonId: number;
};
const createNewStep = async ({ hackathonId }: CreateNewStepInput) => {
  await requireOrganizerSession();

  const lastStep = await prisma.applicationFormStep.findFirst({
    orderBy: {
      position: SortOrder.desc,
    },
    where: {
      hackathonId,
    },
  });

  const newStepNumber = (lastStep?.position ?? 0) + 1;

  await prisma.applicationFormStep.create({
    data: {
      position: newStepNumber,
      title: `Step #${newStepNumber}`,
      hackathonId: hackathonId,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/form-editor`, "page");
};

export default createNewStep;
