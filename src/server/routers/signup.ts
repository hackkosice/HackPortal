import { procedure } from "@/server/trpc";
import { signupSchema } from "@/server/services/validation/auth";
import { hash } from "argon2";
import saveFormFieldValue from "@/server/services/helpers/saveFormFieldValue";

const signup = procedure
  .input(signupSchema)
  .mutation(async ({ input, ctx }) => {
    const { email, password, localApplicationData } = input;

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

    const isOrganizer = email.endsWith("@hackkosice.com");

    if (isOrganizer) {
      await ctx.prisma.organizer.create({
        data: { userId: newUser.id },
      });

      return {
        status: 201,
        message: "Account created successfully",
      };
    }

    const hacker = await ctx.prisma.hacker.create({
      data: { userId: newUser.id },
    });

    if (localApplicationData && localApplicationData.length > 0) {
      const application = await ctx.prisma.application.create({
        data: {
          hackerId: hacker.id,
          statusId: 1,
        },
      });
      for (const fieldValue of localApplicationData) {
        await saveFormFieldValue(ctx.prisma, application.id, fieldValue);
      }
    }

    return {
      status: 201,
      message: "Account created successfully",
    };
  });

export default signup;
