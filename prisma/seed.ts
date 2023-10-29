// noinspection ES6PreferShortImport

import { PrismaClient } from "@prisma/client";
import {
  FormFieldType,
  FormFieldTypeEnum,
} from "../src/services/types/formFields";
import {
  ApplicationStatus,
  ApplicationStatusEnum,
} from "../src/services/types/applicationStatus";
const prisma = new PrismaClient();
async function main() {
  const statuses: ApplicationStatus[] = Object.values(ApplicationStatusEnum);
  for (const status of statuses) {
    await prisma.applicationStatus.upsert({
      where: { name: status },
      update: {},
      create: {
        name: status,
      },
    });
  }

  const fieldTypes: FormFieldType[] = Object.values(FormFieldTypeEnum);

  for (const fieldType of fieldTypes) {
    await prisma.formFieldType.upsert({
      where: { value: fieldType },
      update: {},
      create: {
        value: fieldType,
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
