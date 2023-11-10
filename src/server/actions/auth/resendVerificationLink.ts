"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { randomBytes } from "crypto";
import { sendEmailConfirmationEmail } from "@/services/emails/sendEmail";

const resendVerificationLink = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.id) {
    throw new Error("You must be signed in to resend a verification link");
  }

  if (session.emailVerified) {
    throw new Error("Your email is already verified");
  }
  const userId = session.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const verificationToken = randomBytes(24).toString("hex"); // random string with length 48
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerificationToken: verificationToken,
    },
  });

  await sendEmailConfirmationEmail({
    recipientEmail: user.email,
    verificationToken,
    userId,
  });
};

export default resendVerificationLink;
