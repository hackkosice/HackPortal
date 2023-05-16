import { procedure } from "@/server/trpc";
import { requireAuth } from "@/server/services/requireAuth";

const stepsHacker = procedure.query(async ({ ctx }) => {
  await requireAuth(ctx);

  const steps = await ctx.prisma.applicationFormStep.findMany({
    select: {
      id: true,
      title: true,
      stepNumber: true,
    },
    orderBy: {
      stepNumber: "asc",
    },
  });

  return {
    message: "Steps found",
    data: steps,
  };
});

export default stepsHacker;
