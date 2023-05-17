import { Context } from "@/server/context";
import { TRPCError } from "@trpc/server";

export const requireApplication = async (ctx: Context): Promise<number> => {
  if (!ctx.session?.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to do that",
    });
  }

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

  return application.id;
};
