"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

type CreateNewHackathonInput = {
  name: string;
  title?: string;
  description?: string;
  eventStartDate: Date;
  eventEndDate: Date;
  applicationStartDate: Date;
  applicationEndDate: Date;
};
const createNewHackathon = async ({
  name,
  title,
  description,
  eventStartDate,
  eventEndDate,
  applicationStartDate,
  applicationEndDate,
}: CreateNewHackathonInput) => {
  await requireOrganizerSession();

  await prisma.hackathon.create({
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

  revalidatePath("/dashboard", "layout");
};

export default createNewHackathon;
