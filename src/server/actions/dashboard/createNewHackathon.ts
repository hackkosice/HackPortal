"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";

type CreateNewHackathonInput = {
  name: string;
  description: string;
  eventStartDate: Date;
  eventEndDate: Date;
  applicationStartDate: Date;
  applicationEndDate: Date;
};
const createNewHackathon = async ({
  name,
  description,
  eventStartDate,
  eventEndDate,
  applicationStartDate,
  applicationEndDate,
}: CreateNewHackathonInput) => {
  await prisma.hackathon.create({
    data: {
      name,
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
