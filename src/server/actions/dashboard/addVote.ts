"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

type AddVoteInput = {
  applicationId: number;
  values: {
    voteParameterId: number;
    value: number;
  }[];
};
const addVote = async ({ applicationId, values }: AddVoteInput) => {
  const { id: organizerId } = await requireOrganizerSession();

  if (values.length === 0) {
    throw new Error("No values provided");
  }
  await prisma.$transaction(
    values.map(({ voteParameterId, value }) =>
      prisma.vote.create({
        data: {
          organizerId,
          voteParameterId,
          applicationId,
          value,
        },
      })
    )
  );

  const result = await prisma.voteParameter.findUnique({
    where: {
      id: values[0].voteParameterId,
    },
    select: {
      hackathonId: true,
    },
  });

  if (!result) {
    throw new Error("Vote parameter not found");
  }

  const { hackathonId } = result;

  revalidatePath(`/dashboard/${hackathonId}/applications`, "page");
  revalidatePath(
    `/dashboard/${hackathonId}/applications/${applicationId}/detail`,
    "page"
  );
};

export default addVote;
