"use client";

import React, { useContext } from "react";
import { useSession } from "next-auth/react";
import { datadogLogs } from "@datadog/browser-logs";
import { CookieConsentContext } from "@/components/common/CookieConsentDialog";

const SetDatadogUser = () => {
  const session = useSession();
  const { isTrackingInitialized } = useContext(CookieConsentContext);
  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_DATADOG_ENABLED !== "true") {
      return;
    }

    if (!isTrackingInitialized) {
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
  }, [session, isTrackingInitialized]);
  return null;
};

export default SetDatadogUser;
