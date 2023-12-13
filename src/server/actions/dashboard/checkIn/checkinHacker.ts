"use server";

import { prisma } from "@/services/prisma";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";
import requireOrganizer from "@/services/helpers/requireOrganizer";

type CheckinHackerInput = {
  hackerId: number;
};
const checkinHacker = async ({ hackerId }: CheckinHackerInput) => {
  await requireOrganizer();

  const attendedStatus = await prisma.applicationStatus.findFirst({
    where: {
      name: ApplicationStatusEnum.attended,
    },
  });

  if (!attendedStatus) {
    throw new Error("Missing attended status");
  }

  await prisma.application.update({
    where: {
      hackerId,
    },
    data: {
      statusId: attendedStatus.id,
    },
  });
};

export default checkinHacker;
