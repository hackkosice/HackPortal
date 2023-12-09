"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";
import { revalidatePath } from "next/cache";

type InviteHackerInput = { hackerId: number };
const inviteHacker = async ({ hackerId }: InviteHackerInput) => {
  await requireOrganizerSession();

  const hacker = await prisma.hacker.findUnique({
    where: {
      id: hackerId,
    },
    select: {
      hackathonId: true,
    },
  });

  if (!hacker) {
    throw new Error("Hacker not found");
  }

  const statusInvited = await prisma.applicationStatus.findUnique({
    where: {
      name: ApplicationStatusEnum.invited,
    },
  });

  if (!statusInvited) {
    throw new Error("Application invited status doesn't exist");
  }

  await prisma.application.update({
    data: {
      statusId: statusInvited.id,
    },
    where: {
      hackerId: hackerId,
    },
  });

  revalidatePath(`/dashboard/${hacker.hackathonId}/applications`);
  revalidatePath("/application");
};

export default inviteHacker;
