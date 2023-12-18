import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import requireHacker from "@/services/helpers/requireHacker";
import { createMockUser } from "@/services/jest/user-factory";

jest.mock("next/navigation");
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/app/api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

const getServerSessionMock = getServerSession as jest.Mock;
const redirectMock = redirect as unknown as jest.Mock;
describe("requireHacker", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should redirect to /application when session is not present", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    await requireHacker();
    expect(redirectMock).toHaveBeenCalledWith("/application");
  });

  it("should redirect to /application when user is not present", async () => {
    getServerSessionMock.mockResolvedValueOnce({ id: 1, emailVerified: true });
    createMockUser({ user: null });
    await requireHacker();
    expect(redirectMock).toHaveBeenCalledWith("/application");
  });

  it("should redirect to /application when user is not a hacker", async () => {
    getServerSessionMock.mockResolvedValueOnce({ id: 1, emailVerified: true });
    createMockUser({
      hacker: null,
    });
    await requireHacker();
    expect(redirectMock).toHaveBeenCalledWith("/application");
  });

  it("should redirect to /application when user is a hacker but email is not verified", async () => {
    getServerSessionMock.mockResolvedValueOnce({ id: 1, emailVerified: false });
    createMockUser({
      hacker: {
        id: 1,
      },
    });
    await requireHacker();
    expect(redirectMock).toHaveBeenCalledWith("/application");
  });

  it("should not redirect when there is a session and user is a hacker with email verified", async () => {
    getServerSessionMock.mockResolvedValueOnce({ id: 1, emailVerified: true });
    createMockUser({
      hacker: {
        id: 1,
      },
    });
    await requireHacker();
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
