"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

type DeleteFormFieldInput = {
  fieldId: number;
  force: boolean;
};
const deleteFormField = async ({ fieldId, force }: DeleteFormFieldInput) => {
  await requireOrganizerSession();

  const fieldValues = await prisma.applicationFormFieldValue.findMany({
    where: {
      fieldId,
    },
  });

  if (fieldValues?.length > 0) {
    if (force) {
      await prisma.applicationFormFieldValue.deleteMany({
        where: {
          fieldId,
        },
      });
    } else {
      throw new Error("This form field has some values and force is false");
    }
  }

  const deletedField = await prisma.formField.delete({
    where: {
      id: fieldId,
    },
    select: {
      stepId: true,
      position: true,
    },
  });

  // Update step numbers of all steps after the deleted step
  const fields = await prisma.formField.findMany({
    where: {
      stepId: deletedField.stepId,
    },
  });
  for (const field of fields) {
    if (field.position > deletedField.position) {
      await prisma.formField.update({
        where: {
          id: field.id,
        },
        data: {
          position: field.position - 1,
        },
      });
    }
  }

  revalidatePath(
    `/dashboard/[hackathonId]/form-editor/step/${deletedField.stepId}/edit`,
    "page"
  );
  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${deletedField.stepId}`, "page");
};

export default deleteFormField;
