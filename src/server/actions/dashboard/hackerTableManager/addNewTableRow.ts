"use server";

import { prisma } from "@/services/prisma";

const addNewTableRow = async (hackathonId: number) => {
  await prisma.tableRow.create({
    data: {
      hackathonId: hackathonId,
    },
  });
};

export default addNewTableRow;
