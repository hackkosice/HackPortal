import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const statuses = ["open", "submitted", "invited", "confirmed", "declined"];
  for (const status of statuses) {
    await prisma.applicationStatus.upsert({
      where: { name: status },
      update: {},
      create: {
        name: status,
      },
    });
  }

  const fieldTypes = [
    "text",
    "textarea",
    "radio",
    "select",
    "file",
    "checkbox",
  ];

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
