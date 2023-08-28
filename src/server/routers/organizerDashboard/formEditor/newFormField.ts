import { procedure } from "@/server/trpc";
import { requireOrganizer } from "@/server/services/requireOrganizer";
import { newFormFieldSchema } from "@/server/services/validation/dashboardOrganizer";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;

const newFormField = procedure
  .input(newFormFieldSchema)
  .mutation(async ({ ctx, input }) => {
    await requireOrganizer(ctx);

    const { stepId, typeId, label, name, required } = input;

    const lastFormField = await ctx.prisma.formField.findFirst({
      where: {
        stepId,
      },
      orderBy: {
        position: SortOrder.desc,
      },
    });

    const newFormFieldNumber = (lastFormField?.position ?? 0) + 1;

    const result = await ctx.prisma.formField.create({
      data: {
        stepId,
        typeId,
        label,
        name,
        required,
        position: newFormFieldNumber,
      },
    });

    return {
      message: "Step created successfully",
      data: result,
    };
  });

export default newFormField;
