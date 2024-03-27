"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { ExpectedServerActionError } from "@/services/types/serverErrors";
import { hash } from "argon2";
import { revalidatePath } from "next/cache";

type CreateNewSponsorInput = {
  company: string;
  email: string;
  password: string;
  hackathonId: number;
};
const createNewSponsor = async ({
  company,
  email,
  password,
  hackathonId,
}: CreateNewSponsorInput) => {
  await requireAdminSession();

  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (user) {
    throw new ExpectedServerActionError("User already exists");
  }

  const hashedPassword = await hash(password);
  const { id: newUserId } = await prisma.user.create({
    data: {
      password: hashedPassword,
      email,
      emailVerified: true,
    },
    select: {
      id: true,
    },
  });

  await prisma.sponsor.create({
    data: {
      company,
      userId: newUserId,
      hackathonId,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/settings`, "page");
};

export default createNewSponsor;
