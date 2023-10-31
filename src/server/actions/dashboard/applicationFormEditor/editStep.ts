"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

type EditStepInput = {
  stepId: number;
  title: string;
};
const editStep = async ({ stepId, title }: EditStepInput) => {
  await requireOrganizerSession();

  const { hackathonId } = await prisma.applicationFormStep.update({
    where: {
      id: stepId,
    },
    data: {
      title,
    },
  });

  revalidatePath(
    `/dashboard/${hackathonId}/form-editor/step/${stepId}/edit`,
    "page"
  );
  revalidatePath(`/dashboard/${hackathonId}/form-editor`, "page");
  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${stepId}`, "page");
};

export default editStep;
