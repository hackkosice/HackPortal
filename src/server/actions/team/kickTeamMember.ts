"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireTeamOwnerSession from "@/server/services/helpers/auth/requireTeamOwnerSession";

type KickTeamMemberInput = {
  memberId: number;
};
const kickTeamMember = async ({ memberId }: KickTeamMemberInput) => {
  const { hacker } = await requireTeamOwnerSession();

  if (memberId === hacker.id) {
    throw new Error("You cannot kick yourself");
  }

  await prisma.hacker.update({
    where: {
      id: memberId,
    },
    data: {
      teamId: null,
    },
  });

  revalidatePath("/application", "page");
};

export default kickTeamMember;
