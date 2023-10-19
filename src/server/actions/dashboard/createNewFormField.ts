"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import { revalidatePath } from "next/cache";

type NewFormFieldInput = {
  stepId: number;
  label: string;
  name: string;
  typeId: number;
  required: boolean;
};

const createNewFormField = async ({
  stepId,
  typeId,
  label,
  name,
  required,
}: NewFormFieldInput) => {
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

  const lastFormField = await prisma.formField.findFirst({
    where: {
      stepId,
    },
    orderBy: {
      position: SortOrder.desc,
    },
  });

  const newFormFieldNumber = (lastFormField?.position ?? 0) + 1;

  await prisma.formField.create({
    data: {
      stepId,
      typeId,
      label,
      name,
      required,
      position: newFormFieldNumber,
    },
  });

  revalidatePath(`/dashboard/form-editor/step/${stepId}/edit`, "page");
  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${stepId}`, "page");
};

export default createNewFormField;
