import { Context } from "@/server/context";
import { TRPCError } from "@trpc/server";

export const requireAuth = (ctx: Context) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to do that",
    });
  }
};
