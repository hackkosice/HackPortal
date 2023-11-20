"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";

type MoveFormFieldInput = {
  formFieldId: number;
  direction: "up" | "down";
};
const moveFormField = async ({
  formFieldId,
  direction,
}: MoveFormFieldInput) => {
  const formField = await prisma.formField.findUnique({
    where: {
      id: formFieldId,
    },
    select: {
      step: {
        select: {
          id: true,
          hackathonId: true,
        },
      },
      position: true,
    },
  });
  if (!formField) {
    throw new Error("Form field not found");
  }
  const {
    position: currentPosition,
    step: { hackathonId, id: stepId },
  } = formField;
  const newPosition =
    direction === "up" ? currentPosition - 1 : currentPosition + 1;
  await prisma.$transaction([
    prisma.formField.update({
      where: {
        id: formFieldId,
      },
      data: {
        position: 0,
      },
    }),
    prisma.formField.update({
      where: {
        stepId_position: {
          stepId,
          position: newPosition,
        },
      },
      data: {
        position: currentPosition,
      },
    }),
    prisma.formField.update({
      where: {
        id: formFieldId,
      },
      data: {
        position: newPosition,
      },
    }),
  ]);

  revalidatePath(
    `/dashboard/${hackathonId}/form-editor/step/${stepId}/edit`,
    "page"
  );
  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${stepId}`, "page");
};

export default moveFormField;
