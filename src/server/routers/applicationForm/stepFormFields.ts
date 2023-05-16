import { procedure } from "@/server/trpc";
import { stepFormFieldsSchema } from "@/server/services/validation/applicationForm";
import { TRPCError } from "@trpc/server";
import { requireHacker } from "@/server/services/requireHacker";

const stepFormFields = procedure
  .input(stepFormFieldsSchema)
  .query(async ({ ctx, input }) => {
    await requireHacker(ctx);
    const { stepId } = input;

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

    const applicationFormFieldValues = await ctx.prisma.application.findUnique({
      select: {
        formValues: {
          select: {
            value: true,
            option: {
              select: {
                id: true,
                value: true,
              },
            },
            field: {
              select: {
                stepId: true,
                id: true,
                type: {
                  select: {
                    value: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        hackerId: hacker.id,
      },
    });

    if (!applicationFormFieldValues) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Application not found",
      });
    }

    const fieldValues = applicationFormFieldValues.formValues.filter(
      (value) => value.field.stepId === stepId
    );

    const stepFormFields = await ctx.prisma.applicationFormStep.findUnique({
      select: {
        id: true,
        title: true,
        stepNumber: true,
        formFields: {
          select: {
            id: true,
            formFieldNumber: true,
            label: true,
            name: true,
            required: true,
            type: {
              select: {
                value: true,
              },
            },
            optionList: {
              select: {
                options: {
                  select: {
                    id: true,
                    value: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id: stepId,
      },
    });

    if (!stepFormFields) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Step not found",
      });
    }

    const resultFields = stepFormFields.formFields.map((field) => ({
      ...field,
      initialValue:
        fieldValues.find((value) => value.field.id === field.id)?.value ?? null,
      optionList: field.optionList?.options.map((option) => ({
        value: String(option.id),
        label: option.value,
      })),
    }));

    const result = {
      ...stepFormFields,
      formFields: resultFields,
    };

    return {
      message: "Steps found",
      data: result,
    };
  });

export default stepFormFields;
