"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";
import { revalidatePath } from "next/cache";
import { sendRejectedApplicationEmail } from "@/services/emails/sendEmail";

type RejectHackerInput = { hackerId: number };
const rejectHacker = async ({ hackerId }: RejectHackerInput) => {
  await requireOrganizerSession();

  const hacker = await prisma.hacker.findUnique({
    where: {
      id: hackerId,
    },
    select: {
      hackathonId: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!hacker) {
    throw new Error("Hacker not found");
  }

  const statusRejected = await prisma.applicationStatus.findUnique({
    where: {
      name: ApplicationStatusEnum.rejected,
    },
  });

  if (!statusRejected) {
    throw new Error("Application invited status doesn't exist");
  }

  const application = await prisma.application.update({
    select: {
      id: true,
    },
    data: {
      statusId: statusRejected.id,
    },
    where: {
      hackerId: hackerId,
    },
  });

  void sendRejectedApplicationEmail({
    recipientEmail: hacker.user.email,
  });

  revalidatePath(`/dashboard/${hacker.hackathonId}/applications`, "page");
  revalidatePath(
    `/dashboard/${hacker.hackathonId}/applications/${application.id}/detail`,
    "page"
  );
  revalidatePath("/application", "page");
};

export default rejectHacker;
