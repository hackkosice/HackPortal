import { renderHook } from "@testing-library/react";
import useLog, { LogAction } from "@/services/hooks/useLog";
import { CookieConsentContext } from "@/components/common/CookieConsentDialog";
import { datadogLogs } from "@datadog/browser-logs";

const originalEnv = process.env;

jest.mock("@datadog/browser-logs");

const dataDogLogsMock = jest.fn();
datadogLogs.logger.log = dataDogLogsMock;

const render = ({
  dataDogEnabled = true,
  isTrackingInitialized = true,
  logDebug = false,
}: {
  dataDogEnabled?: boolean;
  isTrackingInitialized?: boolean;
  logDebug?: boolean;
} = {}) => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_DATADOG_ENABLED: dataDogEnabled ? "true" : "false",
    NEXT_PUBLIC_LOG_DEBUG: logDebug ? "true" : "false",
  };
  const { result } = renderHook(useLog, {
    wrapper: ({ children }) => (
      <CookieConsentContext.Provider
        value={{
          cookieConsent: true,
          isTrackingInitialized,
        }}
      >
        {children}
      </CookieConsentContext.Provider>
    ),
  });
  return result.current;
};
describe("useLog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should log when logging enabled and initialized", () => {
    const { log } = render();
    log({
      action: LogAction.PageDisplayed,
      detail: "test",
      data: { test: "test" },
    });

    expect(dataDogLogsMock).toHaveBeenCalledWith(LogAction.PageDisplayed, {
      action: "PageDisplayed",
      data: { test: "test" },
      detail: "test",
    });
  });

  it("should not log when logging disabled", () => {
    const { log } = render({ dataDogEnabled: false });
    log({
      action: LogAction.PageDisplayed,
      detail: "test",
      data: { test: "test" },
    });

    expect(dataDogLogsMock).not.toHaveBeenCalled();
  });

  it("should not log when tracking not initialized", () => {
    const { log } = render({ isTrackingInitialized: false });
    log({
      action: LogAction.PageDisplayed,
      detail: "test",
      data: { test: "test" },
    });

    expect(dataDogLogsMock).not.toHaveBeenCalled();
  });

  it("should log to console when logging enabled and initialized but debug specified", () => {
    const logMock = jest.fn();
    console.log = logMock;
    const { log } = render({ logDebug: true });
    log({
      action: LogAction.PageDisplayed,
      detail: "test",
      data: { test: "test" },
    });

    expect(dataDogLogsMock).not.toHaveBeenCalled();
    expect(logMock).toHaveBeenCalledWith({
      action: "PageDisplayed",
      data: { test: "test" },
      detail: "test",
    });
    jest.resetAllMocks();
  });
});
