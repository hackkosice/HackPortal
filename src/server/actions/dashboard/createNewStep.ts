"use server";

import { prisma } from "@/services/prisma";
import getActiveHackathonId from "@/server/getters/getActiveHackathonId";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/requireOrganizerSession";

const createNewStep = async () => {
  await requireOrganizerSession();

  const lastStep = await prisma.applicationFormStep.findFirst({
    orderBy: {
      position: SortOrder.desc,
    },
  });

  const newStepNumber = (lastStep?.position ?? 0) + 1;

  // Assuming there is always an active hackathon
  const activeHackathonId = (await getActiveHackathonId(prisma)) as number;

  await prisma.applicationFormStep.create({
    data: {
      position: newStepNumber,
      title: `Step #${newStepNumber}`,
      hackathonId: activeHackathonId,
    },
  });

  revalidatePath(`/dashboard/${activeHackathonId}/form-editor`, "page");
};

export default createNewStep;
