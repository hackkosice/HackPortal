"use server";

import { prisma } from "@/services/prisma";
import { ExpectedServerActionError } from "@/services/types/serverErrors";
import { hash } from "argon2";

type ResetPasswordInput = {
  userId: number;
  token: string;
  newPassword: string;
};
const resetPassword = async ({
  userId,
  token,
  newPassword,
}: ResetPasswordInput) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      forgotPasswordToken: true,
      forgotPasswordLastRequest: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.forgotPasswordToken !== token) {
    throw new Error("Invalid token");
  }

  if (!user.forgotPasswordLastRequest) {
    throw new Error("no forgotPasswordLastRequest");
  }

  const now = new Date();
  const diff = now.getTime() - user.forgotPasswordLastRequest.getTime();
  const diffInMinutes = diff / 1000 / 60;
  if (diffInMinutes > 60) {
    throw new ExpectedServerActionError(
      "This password reset link has expired. Please request a new one."
    );
  }

  const hashedPassword = await hash(newPassword);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      forgotPasswordToken: null,
      forgotPasswordLastRequest: null,
    },
  });
};

export default resetPassword;
