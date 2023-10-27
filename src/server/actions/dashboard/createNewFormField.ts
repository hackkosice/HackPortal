"use server";

import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/requireOrganizerSession";

type NewFormFieldInput = {
  stepId: number;
  label: string;
  name: string;
  typeId: number;
  required: boolean;
  optionListId?: number;
};

const createNewFormField = async ({
  stepId,
  typeId,
  label,
  name,
  required,
  optionListId,
}: NewFormFieldInput) => {
  await requireOrganizerSession();

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
      optionListId,
    },
  });

  revalidatePath(
    `/dashboard/[hackathonId]/form-editor/step/${stepId}/edit`,
    "page"
  );
  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${stepId}`, "page");
};

export default createNewFormField;
