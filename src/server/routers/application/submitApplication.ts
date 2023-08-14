import { procedure } from "@/server/trpc";
import { requireApplication } from "@/server/services/requireApplication";
import isApplicationComplete from "@/server/services/helpers/isApplicationComplete";
import { TRPCError } from "@trpc/server";

const submitApplication = procedure.mutation(async ({ ctx }) => {
  const applicationId = await requireApplication(ctx);

  if (!(await isApplicationComplete(ctx, applicationId))) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Application is not complete",
    });
  }

  const statusSubmitted = await ctx.prisma.applicationStatus.findUnique({
    where: {
      name: "submitted",
    },
  });

  if (!statusSubmitted) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Application submitted status doesn't exist",
    });
  }

  await ctx.prisma.application.update({
    data: {
      statusId: statusSubmitted.id,
    },
    where: {
      id: applicationId,
    },
  });

  return {
    message: "Application submitted successfully",
  };
});

export default submitApplication;
