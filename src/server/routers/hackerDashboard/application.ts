import { procedure } from "@/server/trpc";
import { requireHacker } from "@/server/services/requireHacker";
import { TRPCError } from "@trpc/server";
import { isStepCompleted } from "@/server/services/helpers/isApplicationComplete";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;

const application = procedure.query(async ({ ctx }) => {
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

  if (!ctx.session?.id) {
    const steps = stepsDb.map((step) => ({
      ...step,
      isCompleted: false,
    }));

    return {
      message: "Application found",
      signedIn: false,
      data: {
        application: {
          id: null,
          status: {
            name: "open",
          },
        },
        steps,
        canSubmit: false,
      },
    };
  }

  await requireHacker(ctx);

  const hacker = await ctx.prisma.hacker.findUnique({
    select: {
      id: true,
    },
    where: {
      userId: ctx.session.id,
    },
  });

  if (!hacker) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Hacker not found",
    });
  }

  const applicationSelect = {
    id: true,
    status: {
      select: {
        name: true,
      },
    },
  };

  let applicationObject = await ctx.prisma.application.findUnique({
    select: applicationSelect,
    where: {
      hackerId: hacker.id,
    },
  });

  if (!applicationObject) {
    applicationObject = await ctx.prisma.application.create({
      data: {
        hackerId: hacker.id,
        statusId: 1,
      },
      select: applicationSelect,
    });
  }

  const fieldValues = await ctx.prisma.applicationFormFieldValue.findMany({
    where: {
      applicationId: applicationObject.id,
    },
  });

  const steps = stepsDb.map((step) => ({
    ...step,
    isCompleted: isStepCompleted(step.formFields, fieldValues),
  }));

  const canSubmit = steps.every((step) => step.isCompleted);

  return {
    message: "Application found",
    signedIn: true,
    data: {
      application: applicationObject,
      steps,
      canSubmit,
    },
  };
});

export default application;
