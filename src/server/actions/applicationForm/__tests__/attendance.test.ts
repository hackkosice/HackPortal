import confirmAttendance from "@/server/actions/applicationForm/confirmAttendance";
import declineAttendance from "@/server/actions/applicationForm/declineAttendance";
import { prismaMock } from "@/services/jest/prisma-singleton";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";

jest.mock("@/server/services/helpers/auth/requireHackerSession", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    id: 1,
    hackathonId: 2,
  }),
}));

jest.mock("next/cache", () => ({
  __esModule: true,
  revalidatePath: jest.fn(),
}));

describe.each([
  {
    name: "confirmAttendance",
    action: confirmAttendance,
    status: ApplicationStatusEnum.confirmed,
  },
  {
    name: "declineAttendance",
    action: declineAttendance,
    status: ApplicationStatusEnum.declined,
  },
])("$name", ({ action, status }) => {
  it("should throw an error if the status doesn't exist", async () => {
    prismaMock.applicationStatus.findUnique.mockResolvedValue(null);
    await expect(action()).rejects.toThrow(
      `Application ${status} status doesn't exist`
    );
  });

  it("should update the application status", async () => {
    prismaMock.applicationStatus.findUnique.mockResolvedValue({
      id: 5,
      name: status,
    });

    await action();

    expect(prismaMock.applicationStatus.findUnique).toHaveBeenCalledWith({
      where: { name: status },
    });
    expect(prismaMock.application.update).toHaveBeenCalledWith({
      data: { statusId: 5 },
      where: { hackerId: 1 },
    });
  });
});
