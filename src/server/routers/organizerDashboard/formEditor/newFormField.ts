import { procedure } from "@/server/trpc";
import { requireOrganizer } from "@/server/services/requireOrganizer";
import { newFormFieldSchema } from "@/server/services/validation/dashboardOrganizer";

const newFormField = procedure
  .input(newFormFieldSchema)
  .mutation(async ({ ctx, input }) => {
    await requireOrganizer(ctx);

    const { stepId, typeId, label, name, required } = input;

    const result = await ctx.prisma.formField.create({
      data: {
        stepId,
        typeId,
        label,
        name,
        required,
      },
    });

    return {
      message: "Step created successfully",
      data: result,
    };
  });

export default newFormField;
