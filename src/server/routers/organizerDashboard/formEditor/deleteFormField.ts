import { procedure } from "@/server/trpc";
import { deleteFormFieldSchema } from "@/server/services/validation/dashboardOrganizer";
import { requireOrganizer } from "@/server/services/requireOrganizer";
import { TRPCError } from "@trpc/server";

const deleteFormField = procedure
  .input(deleteFormFieldSchema)
  .mutation(async ({ ctx, input }) => {
    await requireOrganizer(ctx);

    const { force, id: fieldId } = input;

    const fieldValues = await ctx.prisma.applicationFormFieldValue.findMany({
      where: {
        fieldId,
      },
    });

    if (fieldValues?.length > 0) {
      if (force) {
        await ctx.prisma.applicationFormFieldValue.deleteMany({
          where: {
            fieldId,
          },
        });
      } else {
        throw new TRPCError({
          message: "This form field has some values and force is false",
          code: "CONFLICT",
        });
      }
    }

    const deletedField = await ctx.prisma.formField.delete({
      where: {
        id: fieldId,
      },
    });

    // Update step numbers of all steps after the deleted step
    const fields = await ctx.prisma.formField.findMany();
    for (const field of fields) {
      if (field.position > deletedField.position) {
        await ctx.prisma.formField.update({
          where: {
            id: field.id,
          },
          data: {
            position: field.position - 1,
          },
        });
      }
    }

    return {
      message: "FormField deleted successfully",
    };
  });

export default deleteFormField;
