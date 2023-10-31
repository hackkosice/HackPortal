"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { revalidatePath } from "next/cache";

type CreateNewVoteParameterInput = {
  hackathonId: number;
  name: string;
  description?: string;
  weight: number;
  minValue: number;
  maxValue: number;
};
const createNewVoteParameter = async ({
  hackathonId,
  name,
  description,
  weight,
  minValue,
  maxValue,
}: CreateNewVoteParameterInput) => {
  await requireOrganizerSession();

  await prisma.voteParameter.create({
    data: {
      hackathonId,
      name,
      description,
      weight,
      minValue,
      maxValue,
    },
  });

  revalidatePath(
    `/dashboard/hackathon/${hackathonId}/settings/vote-parameters`,
    "page"
  );
  revalidatePath(`/dashboard/hackathon/${hackathonId}/applications`, "page");
  revalidatePath(
    `/dashboard/hackathon/${hackathonId}/applications/[applicationId]/detail`,
    "page"
  );
};

export default createNewVoteParameter;
