import { usePathname } from "next/navigation";
import CookieConsentDialog from "@/components/common/CookieConsentDialog";
import { render, screen } from "@testing-library/react";
import { datadogLogs } from "@datadog/browser-logs";
import { init } from "@sentry/nextjs";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));
const pathNameMock = usePathname as jest.MockedFunction<typeof usePathname>;

jest.mock("@datadog/browser-logs", () => ({
  datadogLogs: {
    init: jest.fn(),
  },
}));
const mockDatadogInit = datadogLogs.init as jest.MockedFunction<
  typeof datadogLogs.init
>;

jest.mock("@sentry/nextjs", () => ({
  init: jest.fn(),
}));
const mockSentryInit = init as jest.MockedFunction<typeof init>;

const originalEnv = process.env;

const renderComponent = ({
  trackingEnabled = false,
  pathName = "/",
}: { trackingEnabled?: boolean; pathName?: string } = {}) => {
  pathNameMock.mockReturnValue(pathName);
  if (trackingEnabled) {
    process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN = "123";
    process.env.NEXT_PUBLIC_DATADOG_ENABLED = "true";
    process.env.NEXT_PUBLIC_SENTRY_ENABLED = "true";
  }

  render(
    <CookieConsentDialog>
      <div>Content</div>
    </CookieConsentDialog>
  );
};

describe("CookieConsentDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the cookie
    document.cookie =
      "hk_cookie_consent=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    process.env = { ...originalEnv };
  });

  it("should render with correct content", () => {
    renderComponent();
    expect(screen.getByRole("alertdialog")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Cookie consent" })
    ).toBeVisible();

    expect(screen.getByText("Content")).toBeVisible();

    expect(screen.getByRole("link", { name: "Privacy policy" })).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Privacy policy" })
    ).toHaveAttribute("href", "/privacy-policy");
    expect(screen.getByRole("link", { name: "Cookie policy" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Cookie policy" })).toHaveAttribute(
      "href",
      "/cookie-policy"
    );

    expect(screen.getByRole("button", { name: "Accept all" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Reject all" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Save selection" })
    ).toBeVisible();
  });

  it("should close after accepting set cookie and initialize tracking", async () => {
    expect(document.cookie).toBe("");
    renderComponent({ trackingEnabled: true });
    expect(screen.getByRole("alertdialog")).toBeVisible();

    expect(mockDatadogInit).not.toHaveBeenCalled();
    expect(mockSentryInit).not.toHaveBeenCalled();

    const acceptAllButton = screen.getByRole("button", { name: "Accept all" });
    await userEvent.click(acceptAllButton);

    expect(mockDatadogInit).toHaveBeenCalledTimes(1);
    expect(mockSentryInit).toHaveBeenCalledTimes(1);

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(document.cookie).toBe("hk_cookie_consent=true");
  });

  it("should not init tracking if tracking is disabled", async () => {
    expect(document.cookie).toBe("");
    renderComponent({ trackingEnabled: false });
    expect(screen.getByRole("alertdialog")).toBeVisible();

    expect(mockDatadogInit).not.toHaveBeenCalled();
    expect(mockSentryInit).not.toHaveBeenCalled();

    const acceptAllButton = screen.getByRole("button", { name: "Accept all" });
    await userEvent.click(acceptAllButton);

    expect(mockDatadogInit).not.toHaveBeenCalled();
    expect(mockSentryInit).not.toHaveBeenCalled();

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(document.cookie).toBe("hk_cookie_consent=true");
  });

  it("should close after rejecting set cookie and don't initialize tracking", async () => {
    expect(document.cookie).toBe("");
    renderComponent({ trackingEnabled: true });
    expect(screen.getByRole("alertdialog")).toBeVisible();

    expect(mockDatadogInit).not.toHaveBeenCalled();
    expect(mockSentryInit).not.toHaveBeenCalled();

    const rejectAllButton = screen.getByRole("button", { name: "Reject all" });
    await userEvent.click(rejectAllButton);

    expect(mockDatadogInit).not.toHaveBeenCalled();
    expect(mockSentryInit).not.toHaveBeenCalled();

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(document.cookie).toBe("hk_cookie_consent=false");
  });

  it("doesn't open on privacy policy page", () => {
    renderComponent({ pathName: "/privacy-policy" });
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("doesn't open on cookie policy page", () => {
    renderComponent({ pathName: "/cookie-policy" });
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("doesn't open if cookies are already agreed to but initializes tracking", () => {
    document.cookie = "hk_cookie_consent=true";
    pathNameMock.mockReturnValue("/");
    renderComponent({ trackingEnabled: true });
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(mockDatadogInit).toHaveBeenCalledTimes(1);
    expect(mockSentryInit).toHaveBeenCalledTimes(1);
  });

  it("doesn't open if cookies are already rejected and doesn't initiliaze tracking", () => {
    document.cookie = "hk_cookie_consent=false";
    renderComponent({ trackingEnabled: true });
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(mockDatadogInit).not.toHaveBeenCalled();
    expect(mockSentryInit).not.toHaveBeenCalled();
  });
});
