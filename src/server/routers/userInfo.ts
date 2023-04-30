import { procedure } from "@/server/trpc";
import { requireAuth } from "@/server/services/requireAuth";
import { TRPCError } from "@trpc/server";

const userInfo = procedure.query(async ({ ctx }) => {
  requireAuth(ctx);

  const { prisma, session } = ctx;
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
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
