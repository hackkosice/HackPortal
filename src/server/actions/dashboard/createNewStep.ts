"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import getActiveHackathonId from "@/server/getters/getActiveHackathonId";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import { revalidatePath } from "next/cache";

const createNewStep = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.id) {
    throw new Error("User has to be signed in");
  }

  const organizer = await prisma.organizer.findUnique({
    where: {
      userId: session.id,
    },
  });

  if (!organizer) {
    throw new Error("Organizer not found");
  }

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

  revalidatePath("/dashboard/form-editor", "page");
};

export default createNewStep;
