"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/requireOrganizerSession";
import { revalidatePath } from "next/cache";

type EditOptionInput = {
  optionId: number;
  newValue: string;
};
const editOption = async ({ optionId, newValue }: EditOptionInput) => {
  await requireOrganizerSession();

  const { listId } = await prisma.option.update({
    select: {
      listId: true,
    },
    where: {
      id: optionId,
    },
    data: {
      value: newValue,
    },
  });

  revalidatePath(`/dashboard/option-lists/${listId}/edit`, "page");
};

export default editOption;
