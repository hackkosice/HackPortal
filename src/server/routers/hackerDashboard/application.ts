import { procedure } from "@/server/trpc";
import { requireHacker } from "@/server/services/requireHacker";
import { TRPCError } from "@trpc/server";

const application = procedure.query(async ({ ctx }) => {
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

  const applicationObject = await ctx.prisma.application.findUnique({
    select: applicationSelect,
    where: {
      hackerId: hacker.id,
    },
  });

  if (!applicationObject) {
    const newApplication = await ctx.prisma.application.create({
      data: {
        hackerId: hacker.id,
        statusId: 1,
      },
      select: applicationSelect,
    });

    return {
      message: "Application found",
      data: newApplication,
    };
  }

  return {
    message: "Application found",
    data: applicationObject,
  };
});

export default application;
