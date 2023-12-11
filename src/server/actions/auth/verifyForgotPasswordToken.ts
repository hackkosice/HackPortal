"use server";

import { prisma } from "@/services/prisma";

type VerifyForgotPasswordTokenInput = {
  userId: number;
  token: string;
};
const verifyForgotPasswordToken = async ({
  userId,
  token,
}: VerifyForgotPasswordTokenInput) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      forgotPasswordToken: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.forgotPasswordToken !== token) {
    throw new Error("Invalid token");
  }
};

export default verifyForgotPasswordToken;
