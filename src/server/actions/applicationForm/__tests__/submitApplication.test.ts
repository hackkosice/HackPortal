import { sendSubmittedApplicationEmail } from "@/services/emails/sendEmail";
import submitApplication from "@/server/actions/applicationForm/submitApplication";
import {
  createMockApplication,
  createMockApplicationStatus,
} from "@/services/jest/application-factory";
import isApplicationComplete from "@/server/services/helpers/applications/isApplicationComplete";
import { prismaMock } from "@/services/jest/prisma-singleton";

jest.mock("@/server/services/helpers/auth/requireHackerSession", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    id: 1,
  }),
}));

jest.mock("@/services/emails/sendEmail", () => ({
  __esModule: true,
  sendSubmittedApplicationEmail: jest.fn(),
}));
const mockSendSubmittedApplicationEmail =
  sendSubmittedApplicationEmail as jest.MockedFunction<
    typeof sendSubmittedApplicationEmail
  >;

jest.mock("next/cache", () => ({
  __esModule: true,
  revalidatePath: jest.fn(),
}));

jest.mock(
  "@/server/services/helpers/applications/isApplicationComplete",
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);
const mockIsApplicationComplete = isApplicationComplete as jest.Mock;

describe("submitApplication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should throw an error if the application is not found", async () => {
    createMockApplication({
      application: null,
    });
    await expect(submitApplication()).rejects.toThrow("Application not found");
  });

  it("should throw an error if the application is not complete", async () => {
    createMockApplication();
    mockIsApplicationComplete.mockResolvedValue(false);
    await expect(submitApplication()).rejects.toThrow(
      "Application is not complete"
    );
  });

  it("should update the application status to submitted", async () => {
    createMockApplicationStatus();
    createMockApplication();
    mockIsApplicationComplete.mockResolvedValue(true);
    await submitApplication();
    expect(prismaMock.application.update).toHaveBeenCalledWith({
      data: {
        statusId: 1,
      },
      where: {
        id: 1,
      },
    });
    expect(mockSendSubmittedApplicationEmail).toHaveBeenCalled();
  });
});
