"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";

type EditStepInput = {
  stepId: number;
  title: string;
  description: string;
};
const editStep = async ({ stepId, title, description }: EditStepInput) => {
  await requireAdminSession();

  const { hackathonId } = await prisma.applicationFormStep.update({
    where: {
      id: stepId,
    },
    data: {
      title,
      description,
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
