import { procedure } from "@/server/trpc";
import { stepInfoSchema } from "@/server/services/validation/dashboardOrganizer";
import { requireOrganizer } from "@/server/services/requireOrganizer";
import { TRPCError } from "@trpc/server";

const stepInfo = procedure
  .input(stepInfoSchema)
  .query(async ({ ctx, input }) => {
    await requireOrganizer(ctx);

    const { id } = input;

    const step = await ctx.prisma.applicationFormStep.findFirst({
      where: {
        id,
      },
      include: {
        formFields: {
          include: {
            type: true,
          },
        },
      },
    });

    if (!step) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Step not found",
      });
    }

    return {
      message: "Step updated successfully",
      data: step,
    };
  });

export default stepInfo;
