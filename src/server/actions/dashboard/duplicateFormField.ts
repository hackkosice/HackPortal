"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/requireOrganizerSession";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import { revalidatePath } from "next/cache";

type DuplicateFormFieldInput = {
  formFieldId: number;
};
const duplicateFormField = async ({ formFieldId }: DuplicateFormFieldInput) => {
  await requireOrganizerSession();

  const formField = await prisma.formField.findUnique({
    where: {
      id: formFieldId,
    },
    select: {
      id: true,
      label: true,
      name: true,
      typeId: true,
      required: true,
      optionListId: true,
      step: {
        select: {
          id: true,
          hackathonId: true,
        },
      },
    },
  });

  if (!formField) {
    throw new Error(`FormField with id ${formFieldId} not found`);
  }

  const lastPosition = await prisma.formField.findFirst({
    where: {
      stepId: formField.step.id,
    },
    select: {
      position: true,
    },
    orderBy: {
      position: SortOrder.desc,
    },
  });

  const newPosition = (lastPosition?.position ?? 0) + 1;

  await prisma.formField.create({
    data: {
      label: `${formField.label} - copy`,
      name: `${formField.name}Copy`,
      typeId: formField.typeId,
      stepId: formField.step.id,
      position: newPosition,
      required: formField.required,
      optionListId: formField.optionListId,
    },
  });

  revalidatePath(
    `/dashboard/${formField.step.hackathonId}/form-editor/step/${formField.step.id}/edit`,
    "page"
  );
  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${formField.step.id}`, "page");
};

export default duplicateFormField;
