"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";

export type NewOptionListInput = {
  name: string;
};

const newOptionList = async ({ name }: NewOptionListInput) => {
  await prisma.optionList.create({
    data: {
      name: name,
    },
  });

  revalidatePath("/dashboard/option-lists");
};

export default newOptionList;
