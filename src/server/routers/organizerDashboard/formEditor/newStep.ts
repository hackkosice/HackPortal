import { procedure } from "@/server/trpc";
import { requireOrganizer } from "@/server/services/requireOrganizer";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import getActiveHackathonId from "@/services/helpers/database/getActiveHackathonId";

const newStep = procedure.mutation(async ({ ctx }) => {
  await requireOrganizer(ctx);

  const lastStep = await ctx.prisma.applicationFormStep.findFirst({
    orderBy: {
      position: SortOrder.desc,
    },
  });

  const newStepNumber = (lastStep?.position ?? 0) + 1;

  // Assuming there is always an active hackathon
  const activeHackathonId = (await getActiveHackathonId(ctx.prisma)) as number;

  const result = await ctx.prisma.applicationFormStep.create({
    data: {
      position: newStepNumber,
      title: `Step #${newStepNumber}`,
      hackathonId: activeHackathonId,
    },
  });

  return {
    message: "Step created successfully",
    data: result,
  };
});

export default newStep;
