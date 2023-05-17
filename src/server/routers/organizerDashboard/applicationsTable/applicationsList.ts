import { procedure } from "@/server/trpc";
import { requireOrganizer } from "@/server/services/requireOrganizer";
import createFormValuesObject from "@/server/services/helpers/createFormValuesObject";

const applicationsList = procedure.query(async ({ ctx }) => {
  await requireOrganizer(ctx);

  const applicationsDb = await ctx.prisma.application.findMany({
    select: {
      id: true,
      status: {
        select: {
          name: true,
        },
      },
      formValues: {
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
  });

  const applications = applicationsDb.map((application) => ({
    id: application.id,
    status: application.status.name,
    values: createFormValuesObject(application.formValues),
  }));

  return {
    message: "Application found",
    data: applications,
  };
});

export default applicationsList;
