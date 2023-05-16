import { procedure } from "@/server/trpc";
import { saveFieldValuesSchema } from "@/server/services/validation/applicationForm";
import { TRPCError } from "@trpc/server";
import { requireHacker } from "@/server/services/requireHacker";
import { PrismaClient } from "@prisma/client";

const saveValue = async (
  prisma: PrismaClient,
  applicationId: number,
  fieldId: number,
  values: {
    value?: string;
    optionId?: number;
  }
) => {
  const existingFieldValue = await prisma.applicationFormFieldValue.findUnique({
    where: {
      applicationId_fieldId: {
        applicationId,
        fieldId,
      },
    },
  });
  if (!existingFieldValue) {
    await prisma.applicationFormFieldValue.create({
      data: {
        applicationId,
        fieldId,
        ...values,
      },
    });
    return;
  }
  await prisma.applicationFormFieldValue.update({
    data: {
      ...values,
    },
    where: {
      applicationId_fieldId: {
        applicationId,
        fieldId,
      },
    },
  });
};

const saveFieldValues = procedure
  .input(saveFieldValuesSchema)
  .mutation(async ({ ctx, input }) => {
    await requireHacker(ctx);

    const hacker = await ctx.prisma.hacker.findUnique({
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

    const application = await ctx.prisma.application.findUnique({
      select: {
        id: true,
      },
      where: {
        hackerId: hacker.id,
      },
    });

    if (!application) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Application not found",
      });
    }

    for (const fieldValue of input) {
      const fieldType = await ctx.prisma.formField.findUnique({
        select: {
          type: {
            select: {
              value: true,
            },
          },
        },
        where: {
          id: fieldValue.fieldId,
        },
      });
      if (!fieldType) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Provided fieldId not found in database",
        });
      }
      switch (fieldType.type.value) {
        case "text":
        case "textarea": {
          await saveValue(ctx.prisma, application.id, fieldValue.fieldId, {
            value: fieldValue.value,
          });
          break;
        }
        case "select": {
          const option = await ctx.prisma.option.findUnique({
            select: {
              id: true,
            },
            where: {
              id: Number(fieldValue.value),
            },
          });
          if (!option) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Provided value in select (optionId) not found in database",
            });
          }
          await saveValue(ctx.prisma, application.id, fieldValue.fieldId, {
            optionId: option.id,
          });
          break;
        }
      }
    }

    return {
      message: "Values saved",
    };
  });

export default saveFieldValues;
