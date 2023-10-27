"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/requireOrganizerSession";

type NewFormFieldInput = {
  formFieldId: number;
  label: string;
  name: string;
  typeId: number;
  required: boolean;
  optionListId?: number;
};

const editFormField = async ({
  formFieldId,
  typeId,
  label,
  name,
  required,
  optionListId,
}: NewFormFieldInput) => {
  await requireOrganizerSession();

  const {
    step: { id: stepId, hackathonId },
  } = await prisma.formField.update({
    where: {
      id: formFieldId,
    },
    data: {
      typeId,
      label,
      name,
      required,
      optionListId,
    },
    select: {
      step: {
        select: {
          id: true,
          hackathonId: true,
        },
      },
    },
  });

  revalidatePath(
    `/dashboard/${hackathonId}/form-editor/step/${stepId}/edit`,
    "page"
  );
  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${stepId}`, "page");
};

export default editFormField;
