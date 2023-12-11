"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { randomBytes } from "crypto";
import { sendEmailConfirmationEmail } from "@/services/emails/sendEmail";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

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
    select: {
      emailVerificationLastRequest: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailVerificationLastRequest) {
    const now = new Date();
    const diff = now.getTime() - user.emailVerificationLastRequest.getTime();
    const diffInMinutes = diff / 1000 / 60;
    if (diffInMinutes < 5) {
      throw new ExpectedServerActionError(
        "You can resend a verification link only once every 5 minutes"
      );
    }
  }

  const verificationToken = randomBytes(24).toString("hex"); // random string with length 48
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerificationToken: verificationToken,
      emailVerificationLastRequest: new Date(),
    },
  });

  await sendEmailConfirmationEmail({
    recipientEmail: user.email,
    verificationToken,
    userId,
  });
};

export default resendVerificationLink;
