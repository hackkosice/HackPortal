import { PrismaClient } from "@prisma/client";
import { ApplicationStatusEnum } from "../src/services/types/applicationStatus";

const prisma = new PrismaClient();

const APPLICATION_ID = 1163;

async function main() {
  const confirmedStatus = await prisma.applicationStatus.findUnique({
    where: { name: ApplicationStatusEnum.confirmed },
  });

  if (!confirmedStatus) {
    throw new Error("Confirmed status not found in database");
  }

  const application = await prisma.application.update({
    where: { id: APPLICATION_ID },
    data: { statusId: confirmedStatus.id },
    include: { status: true },
  });

  console.log(
    `Application ${APPLICATION_ID} updated to status: ${application.status.name}`
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
