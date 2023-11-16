"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

type EditHackathonInput = {
  hackathonId: number;
  name: string;
  description?: string;
  title?: string;
  eventStartDate: Date;
  eventEndDate: Date;
  applicationStartDate: Date;
  applicationEndDate: Date;
};
const editHackathon = async ({
  hackathonId,
  name,
  title,
  description,
  eventStartDate,
  eventEndDate,
  applicationStartDate,
  applicationEndDate,
}: EditHackathonInput) => {
  await requireOrganizerSession();

  await prisma.hackathon.update({
    where: {
      id: hackathonId,
    },
    data: {
      name,
      title,
      description,
      eventStartDate,
      eventEndDate,
      applicationStartDate,
      applicationEndDate,
    },
  });

  revalidatePath(`/dashboard/${hackathonId}`, "layout");
};

export default editHackathon;
