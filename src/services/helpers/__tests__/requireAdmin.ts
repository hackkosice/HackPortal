import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import requireAdmin from "@/services/helpers/requireAdmin";

jest.mock("next/navigation");
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/app/api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

jest.mock("@/services/helpers/requireOrganizer", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const getServerSessionMock = getServerSession as jest.Mock;
const redirectMock = redirect as unknown as jest.Mock;

describe("requireAdmin", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should redirect to /dashboard when user is not an admin", async () => {
    getServerSessionMock.mockResolvedValueOnce({
      id: 1,
      emailVerified: true,
      isAdmin: false,
    });
    await requireAdmin();
    expect(redirectMock).toHaveBeenCalledWith("/dashboard");
  });

  it("should not redirect when user is an admin", async () => {
    getServerSessionMock.mockResolvedValueOnce({
      id: 1,
      emailVerified: true,
      isAdmin: true,
    });
    await requireAdmin();
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
