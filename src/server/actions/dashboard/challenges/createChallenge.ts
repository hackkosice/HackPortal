"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type CreateChallengeInput = {
  sponsorId: number;
  title: string;
  description: string;
};
const createChallenge = async ({
  title,
  description,
  sponsorId,
}: CreateChallengeInput) => {
  await requireAdminSession();

  prisma.challenge.create({
    data: {
      title,
      description,
      sponsorId,
    },
  });

  revalidatePath(`/dashboard/${sponsorId}/settings`);
};

export default createChallenge;
