"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { revalidatePath } from "next/cache";

type SetTravelReimbursementRequestDescriptionInput = {
  description: string;
  hackathonId: number;
};
const setTravelReimbursementRequestDescription = async ({
  description,
  hackathonId,
}: SetTravelReimbursementRequestDescriptionInput) => {
  await requireOrganizerSession();

  await prisma.hackathon.update({
    where: {
      id: hackathonId,
    },
    data: {
      travelReimbursementDescription: description,
    },
  });

  revalidatePath("/application", "page");
};

export default setTravelReimbursementRequestDescription;
