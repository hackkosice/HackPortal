"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";

type EditStepInput = {
  stepId: number;
  title: string;
};
const editStep = async ({ stepId, title }: EditStepInput) => {
  const session = await getServerSession(authOptions);

  if (!session?.id) {
    throw new Error("User has to be signed in");
  }

  const organizer = await prisma.organizer.findUnique({
    where: {
      userId: session.id,
    },
  });

  if (!organizer) {
    throw new Error("Organizer not found");
  }

  await prisma.applicationFormStep.update({
    where: {
      id: stepId,
    },
    data: {
      title,
    },
  });

  revalidatePath(`/dashboard/form-editor/step/${stepId}/edit`, "page");
  revalidatePath("/dashboard/form-editor", "page");
  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${stepId}`, "page");
};

export default editStep;
