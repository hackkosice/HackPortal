import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { prisma } from "@/services/prisma";

type Table = {
  id: number;
  code: string;
  teamCount: number;
};
type TableList = {
  tables: Table[];
};

const getTableList = async (hackathonId: number): Promise<TableList> => {
  await requireAdminSession();

  const tables = await prisma.table.findMany({
    where: {
      hackathonId,
    },
    select: {
      id: true,
      code: true,
      teams: {
        select: {
          id: true,
        },
      },
    },
  });

  return {
    tables: tables.map((table) => ({
      id: table.id,
      code: table.code,
      teamCount: table.teams.length,
    })),
  };
};

export default getTableList;
