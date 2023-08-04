import { procedure } from "@/server/trpc";
import { stepFormFieldsSchema } from "@/server/services/validation/applicationForm";
import { TRPCError } from "@trpc/server";
import { requireHacker } from "@/server/services/requireHacker";

const stepFormFields = procedure
  .input(stepFormFieldsSchema)
  .query(async ({ ctx, input }) => {
    // Look for form fields of given step
    const { stepId } = input;
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

    // If user is not signed in return steps with empty initial values
    if (!ctx.session?.id) {
      const resultFields = stepFormFields.formFields.map((field) => ({
        ...field,
        initialValue: null,
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
        signedIn: false,
        data: result,
      };
    }

    // If user is signed in, check if they are a hacker
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

    // Look for application form field values of given step
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
      signedIn: true,
      data: result,
    };
  });

export default stepFormFields;
