"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import isApplicationComplete from "@/server/services/helpers/isApplicationComplete";
import { revalidatePath } from "next/cache";

const submitApplication = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.id) {
    throw new Error("User not logged in");
  }

  const hacker = await prisma.hacker.findUnique({
    where: {
      userId: session.id,
    },
  });

  if (!hacker) {
    throw new Error("Hacker not found");
  }

  const application = await prisma.application.findUnique({
    where: {
      hackerId: hacker.id,
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

  revalidatePath("/application");

  return {
    message: "Application submitted successfully",
  };
};

export default submitApplication;
