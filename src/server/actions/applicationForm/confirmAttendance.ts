"use server";

import { prisma } from "@/services/prisma";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";
import { revalidatePath } from "next/cache";
import requireHackerSession from "@/server/services/helpers/auth/requireHackerSession";

const confirmAttendance = async () => {
  const { id: hackerId, hackathonId } = await requireHackerSession();
  const confirmedStatus = await prisma.applicationStatus.findUnique({
    where: {
      name: ApplicationStatusEnum.confirmed,
    },
  });
  if (!confirmedStatus) {
    throw new Error("Application confirmed status doesn't exist");
  }
  await prisma.application.update({
    data: {
      statusId: confirmedStatus.id,
    },
    where: {
      hackerId: hackerId,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/applications`);
  revalidatePath("/application");
};

export default confirmAttendance;
