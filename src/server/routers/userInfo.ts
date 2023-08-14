import { procedure } from "@/server/trpc";
import { requireAuth } from "@/server/services/requireAuth";
import { TRPCError } from "@trpc/server";
import { Session } from "next-auth";

const userInfo = procedure.query(async ({ ctx }) => {
  requireAuth(ctx);

  // Safe to cast because of requireAuth above
  const session = ctx.session as Session;
  const { prisma } = ctx;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      hacker: true,
      organizer: true,
    },
  });
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }
  return {
    status: 200,
    message: "User found",
    data: user,
  };
});

export default userInfo;
