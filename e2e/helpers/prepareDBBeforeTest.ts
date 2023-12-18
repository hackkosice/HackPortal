import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const DAY = 1000 * 60 * 60 * 24;

async function clearDb(prisma: PrismaClient) {
  await prisma.formFieldVisibilityRule.deleteMany();
  await prisma.travelReimbursementRequest.deleteMany();
  await prisma.account.deleteMany();
  await prisma.file.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.voteParameter.deleteMany();
  await prisma.applicationFormFieldValue.deleteMany();
  await prisma.formField.deleteMany();
  await prisma.applicationFormStep.deleteMany();
  await prisma.application.deleteMany();
  await prisma.team.deleteMany();
  await prisma.hacker.deleteMany();
  await prisma.organizer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hackathon.deleteMany();
  await prisma.option.deleteMany();
  await prisma.optionList.deleteMany();
}

type Options = {
  numberOfHackers?: number;
  numberOfOrganizers?: number;
};
export async function main(
  prisma: PrismaClient,
  options: Options = {
    numberOfHackers: 1,
  }
) {
  await clearDb(prisma);

  const { id: hackathonId } = await prisma.hackathon.create({
    data: {
      name: "Hack Kosice TEST",
      description: "Hack Kosice TEST",
      travelReimbursementDescription: "Hack Kosice TEST reimbursement info",
      applicationStartDate: new Date(new Date().getTime() - DAY),
      applicationEndDate: new Date(new Date().getTime() + 30 * DAY),
      eventStartDate: new Date(new Date().getTime() + 31 * DAY),
      eventEndDate: new Date(new Date().getTime() + 32 * DAY),
    },
  });

  const { id: userId } = await prisma.user.create({
    data: {
      email: "test-hacker@test.com",
      password: await hash("test123456"),
      emailVerified: true,
    },
  });

  const { id: hackerId } = await prisma.hacker.create({
    data: {
      userId,
      hackathonId,
    },
  });

  await prisma.application.create({
    data: {
      hackerId,
      statusId: 1,
    },
  });

  if (options.numberOfHackers && options.numberOfHackers > 1) {
    for (let i = 0; i < options.numberOfHackers - 1; i++) {
      const { id: userId } = await prisma.user.create({
        data: {
          email: `test-hacker-${i + 2}@test.com`,
          password: await hash("test123456"),
          emailVerified: true,
        },
      });

      const { id: hackerId } = await prisma.hacker.create({
        data: {
          userId,
          hackathonId,
        },
      });

      await prisma.application.create({
        data: {
          hackerId,
          statusId: 1,
        },
      });
    }
  }

  const { id: userOrganizerId } = await prisma.user.create({
    data: {
      email: "test-org@hackkosice.com",
      password: await hash("test123456"),
      emailVerified: true,
    },
  });

  if (options.numberOfOrganizers && options.numberOfOrganizers > 1) {
    for (let i = 0; i < options.numberOfOrganizers - 1; i++) {
      const { id: userId } = await prisma.user.create({
        data: {
          email: `test-org-${i + 2}@test.com`,
          password: await hash("test123456"),
          emailVerified: true,
        },
      });

      await prisma.organizer.create({
        data: {
          userId,
          isAdmin: false,
        },
      });
    }
  }

  await prisma.organizer.create({
    data: {
      userId: userOrganizerId,
      isAdmin: true,
    },
  });

  const { id: applicationFormStepId } = await prisma.applicationFormStep.create(
    {
      data: {
        hackathonId,
        title: "General info",
        position: 1,
      },
    }
  );

  const formFieldTypeText = await prisma.formFieldType.findUnique({
    where: {
      value: "text",
    },
  });

  if (formFieldTypeText) {
    await prisma.formField.create({
      data: {
        stepId: applicationFormStepId,
        label: "Full name",
        name: "fullName",
        required: true,
        position: 1,
        typeId: formFieldTypeText.id,
        shownInList: true,
      },
    });
  }
}

export default main;
