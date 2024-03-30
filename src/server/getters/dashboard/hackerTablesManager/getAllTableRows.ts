import { prisma } from "@/services/prisma";

const getAllTableRows = async (hackathonId: number) => {
  const allRows = await prisma.tableRow.findMany({
    where: {
      hackathonId: hackathonId,
    },
    include: {
      HackerTables: {
        include: {
          Team: {
            include: {
              members: true,
            },
          },
        },
      },
    },
  });
  return allRows;
};

export default getAllTableRows;
