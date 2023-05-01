import { procedure } from "@/server/trpc";
import { requireOrganizer } from "@/server/services/requireOrganizer";

const newStep = procedure.mutation(async ({ ctx }) => {
  await requireOrganizer(ctx);

  const lastStep = await ctx.prisma.applicationFormStep.findFirst({
    orderBy: {
      stepNumber: "desc",
    },
  });

  const newStepNumber = (lastStep?.stepNumber ?? 0) + 1;

  const result = await ctx.prisma.applicationFormStep.create({
    data: {
      stepNumber: newStepNumber,
      title: `Step #${newStepNumber}`,
    },
  });

  return {
    message: "Step created successfully",
    data: result,
  };
});

export default newStep;