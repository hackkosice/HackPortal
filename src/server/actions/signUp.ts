"use server";

import { hash } from "argon2";
import createHackerForActiveHackathon from "@/services/helpers/database/createHackerForActiveHackathon";
import saveFormFieldValue from "@/server/services/helpers/applications/saveFormFieldValue";
import { prisma } from "@/services/prisma";
import { SignUpSchema } from "@/scenes/SignUp/SignUp";

const signUp = async ({
  email,
  password,
  localApplicationData,
}: SignUpSchema) => {
  const hashedPassword = await hash(password);
  const isOrganizer = email.endsWith("@hackkosice.com");

  if (isOrganizer) {
    let user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          password: hashedPassword,
          email: email,
        },
      });

      await prisma.organizer.create({
        data: { userId: user.id },
      });

      return {
        message: "Account created successfully",
      };
    }

    return {
      message: "Account already exists",
    };
  }

  const { hackerId: newHackerId } = await createHackerForActiveHackathon(
    prisma,
    email,
    {
      password: hashedPassword,
    }
  );

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
