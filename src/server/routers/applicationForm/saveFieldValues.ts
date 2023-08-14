import { procedure } from "@/server/trpc";
import { saveFieldValuesSchema } from "@/server/services/validation/applicationForm";
import { TRPCError } from "@trpc/server";
import { PrismaClient } from "@prisma/client";
import { requireApplication } from "@/server/services/requireApplication";

const saveValue = async (
  prisma: PrismaClient,
  applicationId: number,
  fieldId: number,
  values: {
    value?: string;
    optionId?: number;
  }
) => {
  await prisma.applicationFormFieldValue.upsert({
    create: {
      applicationId,
      fieldId,
      ...values,
    },
    update: {
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
    const applicationId = await requireApplication(ctx);

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
        case "textarea":
        case "checkbox": {
          await saveValue(ctx.prisma, applicationId, fieldValue.fieldId, {
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
          await saveValue(ctx.prisma, applicationId, fieldValue.fieldId, {
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
