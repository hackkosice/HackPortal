"use server";
import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;

const fixFormFieldPositions = async () => {
  const formFields = await prisma.formField.findMany({
    select: {
      id: true,
      stepId: true,
      position: true,
    },
    orderBy: [
      {
        step: {
          position: SortOrder.asc,
        },
      },
      { position: SortOrder.asc },
    ],
  });

  const stepIds = Array.from(new Set(formFields.map((field) => field.stepId)));
  for (const stepId of stepIds) {
    const fields = formFields.filter((field) => field.stepId === stepId);
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      await prisma.formField.update({
        where: {
          id: field.id,
        },
        data: {
          position: i + 1,
        },
      });
    }
  }
};

export default fixFormFieldPositions;
