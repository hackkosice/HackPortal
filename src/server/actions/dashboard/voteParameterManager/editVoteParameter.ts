"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { revalidatePath } from "next/cache";

type CreateNewVoteParameterInput = {
  voteParameterId: number;
  name: string;
  description?: string;
  weight: number;
  minValue: number;
  maxValue: number;
};
const editVoteParameter = async ({
  voteParameterId,
  name,
  description,
  weight,
  minValue,
  maxValue,
}: CreateNewVoteParameterInput) => {
  await requireOrganizerSession();

  const { hackathonId } = await prisma.voteParameter.update({
    where: {
      id: voteParameterId,
    },
    data: {
      name,
      description,
      weight,
      minValue,
      maxValue,
    },
    select: {
      hackathonId: true,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/settings/vote-parameters`, "page");
  revalidatePath(`/dashboard/${hackathonId}/applications`, "page");
  revalidatePath(
    `/dashboard/${hackathonId}/applications/[applicationId]/detail`,
    "page"
  );
};

export default editVoteParameter;
