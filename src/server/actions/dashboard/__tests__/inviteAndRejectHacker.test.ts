import inviteHacker from "@/server/actions/dashboard/inviteHacker";
import rejectHacker from "@/server/actions/dashboard/rejectHacker";
import {
  sendInvitationEmail,
  sendRejectedApplicationEmail,
} from "@/services/emails/sendEmail";
import { createMockApplicationStatus } from "@/services/jest/application-factory";
import { prismaMock } from "@/services/jest/prisma-singleton";
import { revalidatePath } from "next/cache";

jest.mock("@/server/services/helpers/auth/requireOrganizerSession", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    id: 1,
  }),
}));

jest.mock("@/services/emails/sendEmail", () => ({
  __esModule: true,
  sendInvitationEmail: jest.fn(),
  sendRejectedApplicationEmail: jest.fn(),
}));

jest.mock("next/cache", () => ({
  __esModule: true,
  revalidatePath: jest.fn(),
}));

describe.each([
  {
    name: "inviteHacker",
    action: inviteHacker,
    sendEmail: sendInvitationEmail,
  },
  {
    name: "rejectHacker",
    action: rejectHacker,
    sendEmail: sendRejectedApplicationEmail,
  },
])("$name", ({ action, sendEmail }) => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if the hacker is not found", async () => {
    prismaMock.hacker.findUnique.mockResolvedValue(null);
    await expect(action({ hackerId: 1 })).rejects.toThrow("Hacker not found");
  });

  it("should throw an error if the status doesn't exist", async () => {
    prismaMock.hacker.findUnique.mockResolvedValue({
      hackathonId: 2,
      user: { email: "hacker@email.com" },
    } as never);
    prismaMock.applicationStatus.findUnique.mockResolvedValue(null);
    await expect(action({ hackerId: 1 })).rejects.toThrow(
      "status doesn't exist"
    );
    expect(prismaMock.application.update).not.toHaveBeenCalled();
  });

  it("should update the application status and send an email", async () => {
    prismaMock.hacker.findUnique.mockResolvedValue({
      hackathonId: 2,
      user: { email: "hacker@email.com" },
    } as never);
    createMockApplicationStatus();
    prismaMock.application.update.mockResolvedValue({ id: 3 } as never);

    await action({ hackerId: 1 });

    expect(prismaMock.application.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { statusId: 1 },
        where: { hackerId: 1 },
      })
    );
    expect(sendEmail).toHaveBeenCalledWith({
      recipientEmail: "hacker@email.com",
    });
    expect(revalidatePath).toHaveBeenCalledWith(
      "/dashboard/2/applications/3/detail",
      "page"
    );
  });
});
