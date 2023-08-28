import { procedure } from "@/server/trpc";
import { deleteStepSchema } from "@/server/services/validation/dashboardOrganizer";
import { requireOrganizer } from "@/server/services/requireOrganizer";
import { TRPCError } from "@trpc/server";

const deleteStep = procedure
  .input(deleteStepSchema)
  .mutation(async ({ ctx, input }) => {
    await requireOrganizer(ctx);

    const { id: stepId, force } = input;

    const fields = await ctx.prisma.formField.findMany({
      where: {
        stepId,
      },
    });

    if (fields.length > 0) {
      const fieldsFilter = fields.map((field) => ({
        fieldId: field.id,
      }));

      const fieldValues = await ctx.prisma.applicationFormFieldValue.findMany({
        where: {
          OR: fieldsFilter,
        },
      });

      if (fieldValues.length > 0) {
        if (force) {
          await ctx.prisma.applicationFormFieldValue.deleteMany({
            where: {
              OR: fieldsFilter,
            },
          });
        } else {
          throw new TRPCError({
            message: "This form field has some values and force is false",
            code: "CONFLICT",
          });
        }
      }
      await ctx.prisma.formField.deleteMany({
        where: {
          stepId,
        },
      });
    }

    const deletedStep = await ctx.prisma.applicationFormStep.delete({
      where: {
        id: stepId,
      },
    });

    // Update step numbers of all steps after the deleted step
    const steps = await ctx.prisma.applicationFormStep.findMany();
    for (const step of steps) {
      if (step.position > deletedStep.position) {
        await ctx.prisma.applicationFormStep.update({
          where: {
            id: step.id,
          },
          data: {
            position: step.position - 1,
          },
        });
      }
    }

    return {
      message: "Step deleted successfully",
    };
  });

export default deleteStep;
