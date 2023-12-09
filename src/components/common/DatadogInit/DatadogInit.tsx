"use client";

import { datadogLogs } from "@datadog/browser-logs";

if (
  process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN &&
  process.env.NEXT_PUBLIC_DATADOG_ENABLED === "true"
) {
  datadogLogs.init({
    clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
    site: "datadoghq.eu",
    forwardErrorsToLogs: false,
    sessionSampleRate: 100,
  });
}

export default function DatadogInit() {
  return null;
}
