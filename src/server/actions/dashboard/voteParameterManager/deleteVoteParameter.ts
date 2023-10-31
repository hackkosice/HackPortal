"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { revalidatePath } from "next/cache";

type DeleteVoteParameterInput = {
  voteParameterId: number;
};
const deleteVoteParameter = async ({
  voteParameterId,
}: DeleteVoteParameterInput) => {
  await requireOrganizerSession();

  const votes = await prisma.vote.findMany({
    where: {
      voteParameterId,
    },
  });

  if (votes.length > 0) {
    throw new Error("Cannot delete vote parameter with votes");
  }

  const { hackathonId } = await prisma.voteParameter.delete({
    where: {
      id: voteParameterId,
    },
    select: {
      hackathonId: true,
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

export default deleteVoteParameter;
