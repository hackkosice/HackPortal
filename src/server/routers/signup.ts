import { procedure } from "@/server/trpc";
import { loginSchema } from "@/services/validation/auth";
import { hash } from "argon2";

const signup = procedure.input(loginSchema).mutation(async ({ input, ctx }) => {
  const { email, password } = input;

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

  const newUser = await ctx.prisma.user.create({
    data: { email, password: hashedPassword },
  });

  if (email.endsWith("@hackkosice.com")) {
    await ctx.prisma.organizer.create({
      data: { userId: newUser.id },
    });
  } else {
    await ctx.prisma.hacker.create({
      data: { userId: newUser.id },
    });
  }

  return {
    status: 201,
    message: "Account created successfully",
  };
});

export default signup;
