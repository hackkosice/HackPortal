"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";

type DeleteFormFieldInput = {
  fieldId: number;
  force: boolean;
};
const deleteFormField = async ({ fieldId, force }: DeleteFormFieldInput) => {
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
  });

  // Update step numbers of all steps after the deleted step
  const fields = await prisma.formField.findMany();
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
    `/dashboard/form-editor/step/${deletedField.stepId}/edit`,
    "page"
  );
  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${deletedField.stepId}`, "page");
};

export default deleteFormField;
