"use server";

import { prisma } from "@/services/prisma";
import { LocalApplicationData } from "@/services/helpers/localData/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import saveFormFieldValue from "@/server/services/helpers/applications/saveFormFieldValue";
import { revalidatePath } from "next/cache";

type SyncLocalApplicationDataWithServerInput = {
  hackathonId: number;
  localApplicationData: LocalApplicationData;
};
const syncLocalApplicationDataWithServer = async ({
  hackathonId,
  localApplicationData,
}: SyncLocalApplicationDataWithServerInput) => {
  const session = await getServerSession(authOptions);

  if (!session?.id) {
    throw new Error("User not logged in");
  }

  const userId = session.id;
  const application = await prisma.application.findFirst({
    select: {
      id: true,
    },
    where: {
      hacker: {
        userId,
        hackathonId,
      },
    },
  });
  if (!application) {
    throw new Error("Application not found");
  }
  const applicationId = application.id;
  const existingFieldValues = await prisma.applicationFormFieldValue.findMany({
    select: {
      id: true,
    },
    where: {
      applicationId,
    },
  });

  if (existingFieldValues.length > 0) {
    return;
  }

  for (const field of localApplicationData) {
    await saveFormFieldValue({
      applicationId: application.id,
      userId,
      fieldValue: field,
    });
  }

  revalidatePath("/application", "page");
};

export default syncLocalApplicationDataWithServer;
