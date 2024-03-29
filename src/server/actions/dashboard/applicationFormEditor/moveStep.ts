"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";

type MoveStepInput = {
  stepId: number;
  direction: "up" | "down";
};
const moveStep = async ({ stepId, direction }: MoveStepInput) => {
  await requireAdminSession();
  const step = await prisma.applicationFormStep.findUnique({
    where: {
      id: stepId,
    },
    select: {
      hackathonId: true,
      position: true,
    },
  });
  if (!step) {
    throw new Error("Step not found");
  }
  const { position: currentPosition, hackathonId } = step;
  const newPosition =
    direction === "up" ? currentPosition - 1 : currentPosition + 1;
  const stepCount = await prisma.applicationFormStep.count({
    where: {
      hackathonId,
    },
  });
  if (newPosition <= 0) {
    return;
  }
  if (newPosition > stepCount) {
    return;
  }
  await prisma.$transaction([
    prisma.applicationFormStep.update({
      where: {
        id: stepId,
      },
      data: {
        position: 0,
      },
    }),
    prisma.applicationFormStep.update({
      where: {
        hackathonId_position: {
          hackathonId,
          position: newPosition,
        },
      },
      data: {
        position: currentPosition,
      },
    }),
    prisma.applicationFormStep.update({
      where: {
        id: stepId,
      },
      data: {
        position: newPosition,
      },
    }),
  ]);

  revalidatePath(`/dashboard/${hackathonId}/form-editor`, "page");
  revalidatePath("/application", "page");
};

export default moveStep;
