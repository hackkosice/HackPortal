"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { datadogLogs } from "@datadog/browser-logs";

const SetDatadogUser = () => {
  const session = useSession();
  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_DATADOG_ENABLED !== "true") {
      return;
    }
    const { data, status } = session;
    if (status === "authenticated" && data) {
      datadogLogs.setUser({
        id: data.id.toString(),
        email: data.user?.email ?? "",
      });
    } else {
      datadogLogs.clearUser();
    }
  }, [session]);
  return null;
};

export default SetDatadogUser;
