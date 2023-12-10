"use server";

import { prisma } from "@/services/prisma";
import isApplicationComplete from "@/server/services/helpers/applications/isApplicationComplete";
import { revalidatePath } from "next/cache";
import requireHackerSession from "@/server/services/helpers/auth/requireHackerSession";
import { sendSubmittedApplicationEmail } from "@/services/emails/sendEmail";

const submitApplication = async () => {
  const { id: hackerId } = await requireHackerSession();

  const application = await prisma.application.findUnique({
    where: {
      hackerId: hackerId,
    },
    select: {
      id: true,
      hacker: {
        select: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  if (!(await isApplicationComplete(prisma, application.id))) {
    throw new Error("Application is not complete");
  }

  const statusSubmitted = await prisma.applicationStatus.findUnique({
    where: {
      name: "submitted",
    },
  });

  if (!statusSubmitted) {
    throw new Error("Application submitted status doesn't exist");
  }

  await prisma.application.update({
    data: {
      statusId: statusSubmitted.id,
    },
    where: {
      id: application.id,
    },
  });

  void sendSubmittedApplicationEmail({
    recipientEmail: application.hacker.user.email,
  });

  revalidatePath("/application");

  return {
    message: "Application submitted successfully",
  };
};

export default submitApplication;
