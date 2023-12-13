"use server";

import { hash } from "argon2";
import { prisma } from "@/services/prisma";
import { randomBytes } from "crypto";
import { sendEmailConfirmationEmail } from "@/services/emails/sendEmail";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

type SignUpInput = {
  email: string;
  password: string;
};

const signUp = async ({ email, password }: SignUpInput) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (user) {
    throw new ExpectedServerActionError("User already exists");
  }

  const hashedPassword = await hash(password);
  const verificationToken = randomBytes(24).toString("hex");
  const newUser = await prisma.user.create({
    data: {
      password: hashedPassword,
      email: email,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationLastRequest: new Date(),
    },
  });

  await sendEmailConfirmationEmail({
    recipientEmail: newUser.email,
    verificationToken,
    userId: newUser.id,
  });

  const isOrganizer =
    email.endsWith("@hackkosice.com") || email.endsWith("@hackslovakia.com");
  if (isOrganizer) {
    const organizers = await prisma.organizer.findMany();
    await prisma.organizer.create({
      data: { userId: newUser.id, isAdmin: organizers.length === 0 },
    });
  }

  return {
    message: "Account created successfully",
  };
};

export default signUp;
