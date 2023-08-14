import { Context } from "@/server/context";
import { TRPCError } from "@trpc/server";
import { requireAuth } from "@/server/services/requireAuth";
import { Session } from "next-auth";

export const requireOrganizer = async (ctx: Context) => {
  requireAuth(ctx);

  // Safe to cast because of requireAuth above
  const session = ctx.session as Session;

  const user = await ctx.prisma.user.findUnique({
    where: { id: session.id },
    include: {
      organizer: true,
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  if (!user.organizer) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You must be an organizer to do that",
    });
  }
};
