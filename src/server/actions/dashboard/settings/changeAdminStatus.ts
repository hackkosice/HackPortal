"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type ChangeAdminStatusInput = {
  organizerId: number;
  newIsAdmin: boolean;
  hackathonId: number;
};
const changeAdminStatus = async ({
  organizerId,
  newIsAdmin,
  hackathonId,
}: ChangeAdminStatusInput) => {
  const currentOrganizer = await requireAdminSession();
  if (organizerId === currentOrganizer.id) {
    throw new Error("Cannot change your own admin status");
  }

  await prisma.organizer.update({
    where: {
      id: organizerId,
    },
    data: {
      isAdmin: newIsAdmin,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/settings`);
};

export default changeAdminStatus;
