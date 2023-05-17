import { procedure } from "@/server/trpc";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import { requireApplication } from "@/server/services/requireApplication";
import { isStepCompleted } from "@/server/services/helpers/isApplicationComplete";

const stepsHacker = procedure.query(async ({ ctx }) => {
  const applicationId = await requireApplication(ctx);

  const fieldValues = await ctx.prisma.applicationFormFieldValue.findMany({
    where: {
      applicationId,
    },
  });

  const stepsDb = await ctx.prisma.applicationFormStep.findMany({
    select: {
      id: true,
      title: true,
      stepNumber: true,
      formFields: {
        select: {
          id: true,
          required: true,
          type: {
            select: {
              value: true,
            },
          },
        },
      },
    },
    orderBy: {
      stepNumber: SortOrder.asc,
    },
  });

  const steps = stepsDb.map((step) => ({
    ...step,
    isCompleted: isStepCompleted(step.formFields, fieldValues),
  }));

  const canSubmit = steps.every((step) => step.isCompleted);

  return {
    message: "Steps found",
    data: {
      steps,
      canSubmit,
    },
  };
});

export default stepsHacker;
