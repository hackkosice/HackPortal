import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import requireOrganizer from "@/services/helpers/requireOrganizer";
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

describe("requireOrganizer", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should redirect to /application when session is not present", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    await requireOrganizer();
    expect(redirectMock).toHaveBeenCalledWith("/application");
  });

  it("should redirect to /application when user is not present", async () => {
    getServerSessionMock.mockResolvedValueOnce({ id: 1, emailVerified: true });
    createMockUser({ user: null });
    await requireOrganizer();
    expect(redirectMock).toHaveBeenCalledWith("/application");
  });

  it("should redirect to /application when user is not an organizer", async () => {
    getServerSessionMock.mockResolvedValueOnce({ id: 1, emailVerified: true });
    createMockUser({
      organizer: null,
    });
    await requireOrganizer();
    expect(redirectMock).toHaveBeenCalledWith("/application");
  });

  it("should redirect to /org-verify-email when user is an organizer but email is not verified", async () => {
    getServerSessionMock.mockResolvedValueOnce({ id: 1, emailVerified: false });
    createMockUser({
      organizer: {
        id: 1,
      },
    });
    await requireOrganizer();
    expect(redirectMock).toHaveBeenCalledWith("/org-verify-email");
  });

  it("should not redirect when there is a session and user is an organizer with email verified", async () => {
    getServerSessionMock.mockResolvedValueOnce({ id: 1, emailVerified: true });
    createMockUser({
      organizer: {
        id: 1,
      },
    });
    await requireOrganizer();
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
