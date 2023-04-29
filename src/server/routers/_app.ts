import { procedure, router } from "../trpc";
import { signUpSchema } from "@/services/validation/auth";
import { hash } from "argon2";
export const appRouter = router({
  signup: procedure.input(signUpSchema).mutation(async ({ input, ctx }) => {
    const { name, email, password } = input;

    const exists = await ctx.prisma.user.findFirst({
      where: { email },
    });

    if (exists) {
      return {
        status: 500,
        message: "User already exists",
      };
    }

    const hashedPassword = await hash(password);

    const result = await ctx.prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return {
      status: 201,
      message: "Account created successfully",
      result: result.email,
    };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
