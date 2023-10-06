import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();
const DAY = 1000 * 60 * 60 * 24;

async function clearDb() {
  await prisma.applicationFormFieldValue.deleteMany();
  await prisma.formField.deleteMany();
  await prisma.applicationFormStep.deleteMany();
  await prisma.application.deleteMany();
  await prisma.hacker.deleteMany();
  await prisma.organizer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hackathon.deleteMany();
}

async function main() {
  await clearDb();

  const { id: hackathonId } = await prisma.hackathon.create({
    data: {
      name: "Hack Kosice TEST",
      description: "Hack Kosice TEST",
      applicationStartDate: new Date(new Date().getTime() - DAY),
      applicationEndDate: new Date(new Date().getTime() + 30 * DAY),
      eventStartDate: new Date(new Date().getTime() + 31 * DAY),
      eventEndDate: new Date(new Date().getTime() + 32 * DAY),
    },
  });

  const { id: userId } = await prisma.user.create({
    data: {
      email: "test-hacker@test.com",
      password: await hash("test123"),
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

  const { id: userOrganizerId } = await prisma.user.create({
    data: {
      email: "test-org@hackkosice.com",
      password: await hash("test123"),
    },
  });

  await prisma.organizer.create({
    data: {
      userId: userOrganizerId,
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
        label: "First name",
        name: "firstName",
        required: true,
        position: 1,
        typeId: formFieldTypeText.id,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
