import { datadogLogs } from "@datadog/browser-logs";
import { useCallback, useContext } from "react";
import { CookieConsentContext } from "@/components/common/CookieConsentDialog";

export const LogAction = {
  ButtonClicked: "ButtonClicked",
  CardClicked: "CardClicked",
  PageDisplayed: "PageDisplayed",
} as const;

export type LogActionType = (typeof LogAction)[keyof typeof LogAction];

type LogProps = {
  action: LogActionType;
  detail: string;
  data?: Record<string, unknown>;
};
const useLog = () => {
  const { isTrackingInitialized } = useContext(CookieConsentContext);
  const log = useCallback(
    ({ action, detail, data }: LogProps) => {
      if (process.env.NEXT_PUBLIC_DATADOG_ENABLED !== "true") {
        return;
      }
      if (!isTrackingInitialized) {
        return;
      }
      if (process.env.NEXT_PUBLIC_LOG_DEBUG) {
        console.log({ action, detail, data });
        return;
      }
      datadogLogs.logger.log(action, { action, detail, data });
    },
    [isTrackingInitialized]
  );

  return { log };
};

export default useLog;
