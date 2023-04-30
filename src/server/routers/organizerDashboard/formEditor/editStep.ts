import { procedure } from "@/server/trpc";
import { editStepSchema } from "@/server/services/validation/dashboardOrganizer";
import { requireOrganizer } from "@/server/services/requireOrganizer";

const editStep = procedure
  .input(editStepSchema)
  .mutation(async ({ ctx, input }) => {
    await requireOrganizer(ctx);

    const { title, id } = input;

    await ctx.prisma.applicationFormStep.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });

    return {
      message: "Step updated successfully",
    };
  });

export default editStep;
