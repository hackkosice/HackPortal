"use server";

import { hash } from "argon2";
import createHackerForActiveHackathon from "@/services/helpers/database/createHackerForActiveHackathon";
import { prisma } from "@/services/prisma";
import { SignUpSchema } from "@/scenes/SignUp/SignUp";
import { randomBytes } from "crypto";
import { sendEmailConfirmationEmail } from "@/services/emails/sendEmail";

const signUp = async ({ email, password }: SignUpSchema) => {
  const hashedPassword = await hash(password);
  const isOrganizer = email.endsWith("@hackkosice.com");

  if (isOrganizer) {
    let user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      const verificationToken = randomBytes(24).toString("hex");
      user = await prisma.user.create({
        data: {
          password: hashedPassword,
          email: email,
          emailVerified: false,
          emailVerificationToken: verificationToken,
        },
      });

      await prisma.organizer.create({
        data: { userId: user.id },
      });

      await sendEmailConfirmationEmail({
        recipientEmail: user.email,
        verificationToken,
        userId: user.id,
      });

      return {
        message: "Account created successfully",
      };
    }

    return {
      message: "Account already exists",
    };
  }

  const { user } = await createHackerForActiveHackathon(prisma, email, {
    password: hashedPassword,
  });

  if (!user.emailVerificationToken) {
    throw new Error("Email verification token not found");
  }

  await sendEmailConfirmationEmail({
    recipientEmail: user.email,
    verificationToken: user.emailVerificationToken,
    userId: user.id,
  });
};

export default signUp;
