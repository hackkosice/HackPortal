import { procedure } from "@/server/trpc";
import { requireOrganizer } from "@/server/services/requireOrganizer";

const formFieldTypes = procedure.query(async ({ ctx }) => {
  await requireOrganizer(ctx);

  const formFieldTypes = await ctx.prisma.formFieldType.findMany();

  return {
    message: "Steps found",
    data: formFieldTypes,
  };
});

export default formFieldTypes;
