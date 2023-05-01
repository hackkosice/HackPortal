import { procedure } from "@/server/trpc";
import { deleteStepSchema } from "@/server/services/validation/dashboardOrganizer";
import { requireOrganizer } from "@/server/services/requireOrganizer";

const deleteStep = procedure
  .input(deleteStepSchema)
  .mutation(async ({ ctx, input }) => {
    await requireOrganizer(ctx);

    const deletedStep = await ctx.prisma.applicationFormStep.delete({
      where: {
        id: input.id,
      },
    });

    // Update step numbers of all steps after the deleted step
    const steps = await ctx.prisma.applicationFormStep.findMany();
    for (const step of steps) {
      if (step.stepNumber > deletedStep.stepNumber) {
        await ctx.prisma.applicationFormStep.update({
          where: {
            id: step.id,
          },
          data: {
            stepNumber: step.stepNumber - 1,
          },
        });
      }
    }

    return {
      message: "Step deleted successfully",
    };
  });

export default deleteStep;
