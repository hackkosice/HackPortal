"use server";

import { prisma } from "@/services/prisma";
import { randomBytes } from "crypto";
import { sendEmailForgotPassword } from "@/services/emails/sendEmail";

type RequestPasswordResetInput = {
  email: string;
};
const requestPasswordReset = async ({ email }: RequestPasswordResetInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      forgotPasswordLastRequest: true,
      accounts: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    return;
  }

  if (user.accounts.length > 0) {
    return;
  }

  if (user.forgotPasswordLastRequest) {
    const now = new Date();
    const diff = now.getTime() - user.forgotPasswordLastRequest.getTime();
    const diffInMinutes = diff / 1000 / 60;
    if (diffInMinutes < 5) {
      return;
    }
  }

  const verificationToken = randomBytes(24).toString("hex"); // random string with length 48
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      forgotPasswordToken: verificationToken,
      forgotPasswordLastRequest: new Date(),
    },
  });

  void sendEmailForgotPassword({
    recipientEmail: user.email,
    verificationToken,
    userId: user.id,
  });
};

export default requestPasswordReset;
