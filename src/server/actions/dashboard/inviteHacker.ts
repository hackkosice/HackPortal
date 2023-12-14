"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";
import { revalidatePath } from "next/cache";
import { sendInvitationEmail } from "@/services/emails/sendEmail";

type InviteHackerInput = { hackerId: number };
const inviteHacker = async ({ hackerId }: InviteHackerInput) => {
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

  const statusInvited = await prisma.applicationStatus.findUnique({
    where: {
      name: ApplicationStatusEnum.invited,
    },
  });

  if (!statusInvited) {
    throw new Error("Application invited status doesn't exist");
  }

  const application = await prisma.application.update({
    select: {
      id: true,
    },
    data: {
      statusId: statusInvited.id,
    },
    where: {
      hackerId: hackerId,
    },
  });

  void sendInvitationEmail({
    recipientEmail: hacker.user.email,
  });

  revalidatePath(`/dashboard/${hacker.hackathonId}/applications`, "page");
  revalidatePath(
    `/dashboard/${hacker.hackathonId}/applications/${application.id}/detail`,
    "page"
  );
  revalidatePath("/application", "page");
};

export default inviteHacker;
