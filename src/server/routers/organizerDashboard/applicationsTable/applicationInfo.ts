import { procedure } from "@/server/trpc";
import { requireOrganizer } from "@/server/services/requireOrganizer";
import { applicationInfoSchema } from "@/server/services/validation/dashboardOrganizer";
import { TRPCError } from "@trpc/server";
import createFormValuesObject from "@/server/services/helpers/createFormValuesObject";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;

const applicationInfo = procedure
  .input(applicationInfoSchema)
  .query(async ({ ctx, input }) => {
    await requireOrganizer(ctx);

    const { id: applicationId } = input;

    const application = await ctx.prisma.application.findUnique({
      select: {
        id: true,
        status: {
          select: {
            name: true,
          },
        },
        formValues: {
          orderBy: [
            {
              field: {
                step: {
                  position: SortOrder.asc,
                },
              },
            },
            {
              field: {
                position: SortOrder.asc,
              },
            },
          ],
          select: {
            value: true,
            field: {
              select: {
                label: true,
                type: {
                  select: {
                    value: true,
                  },
                },
              },
            },
            option: {
              select: {
                value: true,
              },
            },
          },
        },
      },
      where: {
        id: applicationId,
      },
    });

    if (!application) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Application not found",
      });
    }

    const result = {
      id: application.id,
      status: application.status.name,
      values: createFormValuesObject(application.formValues),
    };

    return {
      message: "Application found",
      data: result,
    };
  });

export default applicationInfo;
