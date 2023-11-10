import "server-only";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";

type VerifyUserInput = {
  userIdParam: number;
  verificationToken: string;
};
type VerifyUserReturn =
  | {
      success: true;
      isSignedIn: boolean;
    }
  | {
      success: false;
      error: string;
    };
const verifyUser = async ({
  userIdParam,
  verificationToken,
}: VerifyUserInput): Promise<VerifyUserReturn> => {
  const session = await getServerSession(authOptions);
  if (session?.id && session.id !== userIdParam) {
    return {
      success: false,
      error: "You are not authorized to verify this user",
    };
  }
  const userId = session?.id ?? userIdParam;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return {
      success: false,
      error: "User not found",
    };
  }

  if (user.emailVerified) {
    return {
      success: false,
      error: "Your email is already verified",
    };
  }

  if (user.emailVerificationToken !== verificationToken) {
    return {
      success: false,
      error: "Invalid verification token",
    };
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
    },
  });

  revalidatePath("/application");

  return {
    success: true,
    isSignedIn: Boolean(session?.id),
  };
};

export default verifyUser;
