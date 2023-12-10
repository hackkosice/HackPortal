"use client";

import React from "react";
import useLog, { LogActionType } from "@/services/hooks/useLog";

type LogMountProps = {
  action: LogActionType;
  detail: string;
  data?: Record<string, unknown>;
};
const LogMount = ({ action, detail, data }: LogMountProps) => {
  const { log } = useLog();
  React.useEffect(() => {
    log({ action, detail, data });
  }, [action, data, detail, log]);
  return null;
};

export default LogMount;
