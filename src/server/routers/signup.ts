import { procedure } from "@/server/trpc";
import { signupSchema } from "@/server/services/validation/auth";
import { hash } from "argon2";
import saveFormFieldValue from "@/server/services/helpers/saveFormFieldValue";
import createHackerForActiveHackathon from "@/services/helpers/database/createHackerForActiveHackathon";

const signup = procedure
  .input(signupSchema)
  .mutation(async ({ input, ctx }) => {
    const { email, password, localApplicationData } = input;

    const hashedPassword = await hash(password);

    const { userId: newUserId, hackerId: newHackerId } =
      await createHackerForActiveHackathon(ctx.prisma, email, {
        password: hashedPassword,
      });

    const isOrganizer = email.endsWith("@hackkosice.com");

    if (isOrganizer && newUserId) {
      await ctx.prisma.organizer.create({
        data: { userId: newUserId },
      });

      return {
        status: 201,
        message: "Account created successfully",
      };
    }

    if (localApplicationData && localApplicationData.length > 0) {
      const application = await ctx.prisma.application.create({
        data: {
          hackerId: newHackerId,
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
