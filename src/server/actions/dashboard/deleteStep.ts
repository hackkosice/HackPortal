"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/requireOrganizerSession";

type DeleteStepInput = {
  stepId: number;
  force: boolean;
};
const deleteStep = async ({ stepId, force }: DeleteStepInput) => {
  await requireOrganizerSession();

  const fields = await prisma.formField.findMany({
    where: {
      stepId,
    },
  });

  if (fields.length > 0) {
    if (force) {
      const fieldsFilter = fields.map((field) => ({
        fieldId: field.id,
      }));
      await prisma.applicationFormFieldValue.deleteMany({
        where: {
          OR: fieldsFilter,
        },
      });
      await prisma.formField.deleteMany({
        where: {
          stepId,
        },
      });
    } else {
      throw new Error("This step has some form fields and force is false");
    }
  }

  const deletedStep = await prisma.applicationFormStep.delete({
    where: {
      id: stepId,
    },
  });

  // Update step numbers of all steps after the deleted step
  const steps = await prisma.applicationFormStep.findMany({
    where: {
      hackathonId: deletedStep.hackathonId,
    },
  });
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

  revalidatePath(`/dashboard/${deletedStep.hackathonId}/form-editor`, "page");
};

export default deleteStep;
