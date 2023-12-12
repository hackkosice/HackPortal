"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type EditOptionInput = {
  optionId: number;
  newValue: string;
};
const editOption = async ({ optionId, newValue }: EditOptionInput) => {
  await requireAdminSession();

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

  revalidatePath(`/option-lists/${listId}/edit`, "page");
};

export default editOption;
