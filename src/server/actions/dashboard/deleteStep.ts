"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";

type DeleteStepInput = {
  stepId: number;
  force: boolean;
};
const deleteStep = async ({ stepId, force }: DeleteStepInput) => {
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

  const fields = await prisma.formField.findMany({
    where: {
      stepId,
    },
  });

  if (fields.length > 0) {
    const fieldsFilter = fields.map((field) => ({
      fieldId: field.id,
    }));

    const fieldValues = await prisma.applicationFormFieldValue.findMany({
      where: {
        OR: fieldsFilter,
      },
    });

    if (fieldValues.length > 0) {
      if (force) {
        await prisma.applicationFormFieldValue.deleteMany({
          where: {
            OR: fieldsFilter,
          },
        });
      } else {
        throw new Error("This form field has some values and force is false");
      }
    }
    await prisma.formField.deleteMany({
      where: {
        stepId,
      },
    });
  }

  const deletedStep = await prisma.applicationFormStep.delete({
    where: {
      id: stepId,
    },
  });

  // Update step numbers of all steps after the deleted step
  const steps = await prisma.applicationFormStep.findMany();
  for (const step of steps) {
    if (step.position > deletedStep.position) {
      await prisma.applicationFormStep.update({
        where: {
          id: step.id,
        },
        data: {
          position: step.position - 1,
        },
      });
    }
  }

  revalidatePath("/dashboard/form-editor", "page");
};

export default deleteStep;
