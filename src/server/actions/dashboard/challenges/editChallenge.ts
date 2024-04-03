"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type EditChallengeInput = {
  challengeId: number;
  title: string;
  description: string;
};
const editChallenge = async ({
  challengeId,
  title,
  description,
}: EditChallengeInput) => {
  await requireAdminSession();

  await prisma.challenge.update({
    where: {
      id: challengeId,
    },
    data: {
      title,
      description,
    },
  });

  revalidatePath(`/dashboard/${challengeId}/settings`);
};

export default editChallenge;
