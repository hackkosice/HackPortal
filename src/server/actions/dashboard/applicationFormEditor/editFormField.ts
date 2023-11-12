"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

type NewFormFieldInput = {
  formFieldId: number;
  label: string;
  name: string;
  typeId: number;
  required: boolean;
  optionListId?: number;
  newOptionListName?: string;
  description?: string;
  shouldBeShownInList?: boolean;
};

const editFormField = async ({
  formFieldId,
  typeId,
  label,
  name,
  required,
  optionListId,
  newOptionListName,
  shouldBeShownInList,
  description,
}: NewFormFieldInput) => {
  await requireOrganizerSession();

  let newOptionListId: number | null = null;
  if (newOptionListName) {
    const { id } = await prisma.optionList.create({
      data: {
        name: newOptionListName,
      },
      select: {
        id: true,
      },
    });
    newOptionListId = id;
  }

  const {
    step: { id: stepId, hackathonId },
  } = await prisma.formField.update({
    where: {
      id: formFieldId,
    },
    data: {
      typeId,
      label,
      description,
      name,
      required,
      optionListId: newOptionListId ?? optionListId,
      shownInList: shouldBeShownInList,
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
