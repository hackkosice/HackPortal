"use server";

import { prisma } from "@/services/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import saveFormFieldValue from "@/server/services/helpers/applications/saveFormFieldValue";

export type SaveApplicationStepFormInput = {
  stepId: number;
  fieldValues: {
    fieldId: number;
    value: string;
  }[];
};

const saveApplicationStepForm = async ({
  fieldValues,
  stepId,
}: SaveApplicationStepFormInput) => {
  const session = await getServerSession(authOptions);

  if (!session?.id) {
    throw new Error("User not logged in");
  }
  const userId = session.id;

  const hacker = await prisma.hacker.findUnique({
    where: {
      userId,
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

  for (const fieldValue of fieldValues) {
    await saveFormFieldValue({
      applicationId: application.id,
      userId,
      fieldValue,
    });
  }

  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${stepId}`, "page");

  return;
};

export default saveApplicationStepForm;
