import { procedure } from "@/server/trpc";
import { requireOrganizer } from "@/server/services/requireOrganizer";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;

const steps = procedure.query(async ({ ctx }) => {
  await requireOrganizer(ctx);

  const steps = await ctx.prisma.applicationFormStep.findMany({
    orderBy: {
      stepNumber: SortOrder.asc,
    },
  });

  return {
    message: "Steps found",
    data: steps,
  };
});

export default steps;
