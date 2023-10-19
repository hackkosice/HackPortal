"use server";

import { hash } from "argon2";
import createHackerForActiveHackathon from "@/services/helpers/database/createHackerForActiveHackathon";
import saveFormFieldValue from "@/server/services/helpers/saveFormFieldValue";
import { prisma } from "@/services/prisma";
import { SignUpSchema } from "@/scenes/SignUp/SignUp";

const signUp = async ({
  email,
  password,
  localApplicationData,
}: SignUpSchema) => {
  const hashedPassword = await hash(password);

  const { userId: newUserId, hackerId: newHackerId } =
    await createHackerForActiveHackathon(prisma, email, {
      password: hashedPassword,
    });

  const isOrganizer = email.endsWith("@hackkosice.com");

  if (isOrganizer && newUserId) {
    await prisma.organizer.create({
      data: { userId: newUserId },
    });

    return {
      status: 201,
      message: "Account created successfully",
    };
  }

  if (localApplicationData && localApplicationData.length > 0) {
    const application = await prisma.application.create({
      data: {
        hackerId: newHackerId,
        statusId: 1,
      },
    });
    for (const fieldValue of localApplicationData) {
      await saveFormFieldValue(prisma, application.id, fieldValue);
    }
  }
};

export default signUp;
