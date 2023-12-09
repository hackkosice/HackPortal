"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import saveFormFieldValue, {
  FieldValue,
} from "@/server/services/helpers/applications/saveFormFieldValue";
import requireHackerSession from "@/server/services/helpers/auth/requireHackerSession";

export type SaveApplicationStepFormInput = {
  stepId: number;
  fieldValues: Omit<FieldValue, "stepId">[];
};

const saveApplicationStepForm = async ({
  fieldValues,
  stepId,
}: SaveApplicationStepFormInput) => {
  const { id: hackerId, userId } = await requireHackerSession({
    verified: false,
  });

  const application = await prisma.application.findUnique({
    where: {
      hackerId: hackerId,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  for (const fieldValue of fieldValues) {
    await saveFormFieldValue({
      applicationId: application.id,
      userId,
      fieldValue: {
        ...fieldValue,
        stepId,
      },
    });
  }

  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${stepId}`, "page");

  return;
};

export default saveApplicationStepForm;
