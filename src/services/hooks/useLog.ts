import { datadogLogs } from "@datadog/browser-logs";

export const LogAction = {
  ButtonClicked: "ButtonClicked",
  CardClicked: "CardClicked",
} as const;

type LogActionType = (typeof LogAction)[keyof typeof LogAction];

type LogProps = {
  action: LogActionType;
  detail: string;
  data: Record<string, unknown>;
};
const useLog = () => {
  const log = ({ action, detail, data }: LogProps) => {
    if (process.env.NEXT_PUBLIC_DATADOG_ENABLED !== "true") {
      return;
    }
    datadogLogs.logger.log(action, { action, detail, data });
  };

  return { log };
};

export default useLog;
