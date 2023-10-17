"use server";

import { prisma } from "@/services/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import saveFormFieldValue from "@/server/services/helpers/saveFormFieldValue";

export type SaveApplicationStepFormInput = {
  stepId: string;
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

  for (const fieldValue of fieldValues) {
    await saveFormFieldValue(prisma, application.id, fieldValue);
  }

  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${stepId}`, "page");
  redirect("/application");

  return {
    message: "Values saved",
  };
};

export default saveApplicationStepForm;
