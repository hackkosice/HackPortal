"use client";

import React, { createContext, ReactNode, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { datadogLogs } from "@datadog/browser-logs";
import * as Sentry from "@sentry/nextjs";
import { usePathname } from "next/navigation";

type CookieConsentContextType = {
  cookieConsent: boolean;
  isTrackingInitialized?: boolean;
};

export const CookieConsentContext = createContext<CookieConsentContextType>({
  cookieConsent: false,
});

const initTracking = () => {
  if (
    process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN &&
    process.env.NEXT_PUBLIC_DATADOG_ENABLED === "true"
  ) {
    datadogLogs.init({
      clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
      site: process.env.NEXT_PUBLIC_DATADOG_SITE,
      forwardErrorsToLogs: false,
      sessionSampleRate: 100,
    });
  }

  if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1,
      debug: false,
    });
  }
};

const CookieConsentDialog = ({ children }: { children: ReactNode }) => {
  const path = usePathname();
  const [showDialog, setShowDialog] = React.useState(false);
  const [performanceAndAnalyticsConsent, setPerformanceAndAnalyticsConsent] =
    React.useState(false);
  const [cookieConsentContext, setCookieConsentContext] = React.useState(false);
  const [isTrackingInitialized, setIsTrackingInitialized] =
    React.useState(false);

  useEffect(() => {
    if (
      path.startsWith("/privacy-policy") ||
      path.startsWith("/cookie-policy")
    ) {
      setShowDialog(false);
      return;
    }
    const cookie = document.cookie.split(";").find((cookie) => {
      return cookie.trim().startsWith("hk_cookie_consent=");
    });

    if (!cookie) {
      setShowDialog(true);
    } else {
      const value = cookie.split("=")[1];
      setCookieConsentContext(value === "true");
      if (value === "true") {
        initTracking();
        setIsTrackingInitialized(true);
      }
    }
  }, [path]);

  const onAcceptAllClick = () => {
    setPerformanceAndAnalyticsConsent(true);

    setCookieConsentContext(true);
    initTracking();
    setIsTrackingInitialized(true);
    document.cookie = `hk_cookie_consent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;

    setShowDialog(false);
  };

  const onRejectAllClick = () => {
    setPerformanceAndAnalyticsConsent(false);

    setCookieConsentContext(false);
    document.cookie = `hk_cookie_consent=false; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;

    setShowDialog(false);
  };

  const onAcceptSelectionClick = () => {
    if (performanceAndAnalyticsConsent) {
      onAcceptAllClick();
    } else {
      onRejectAllClick();
    }
  };
  return (
    <>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="md:w-[70vw]">
          <AlertDialogHeader>
            <Heading size="medium">Cookie consent</Heading>
          </AlertDialogHeader>
          <Text>
            Hack Kosice Application portal uses cookies in a range of ways to
            improve your experience on our website. You can choose for each
            category to opt-in/opt-out whenever you want. For more information
            about how we store your data and use cookies visit our{" "}
            <Link href="/privacy-policy" className="text-hkOrange underline">
              Privacy policy
            </Link>{" "}
            and{" "}
            <Link href="/cookie-policy" className="text-hkOrange underline">
              Cookie policy
            </Link>
            .
          </Text>
          <Stack direction="row" alignItems="center">
            <Switch checked={true} />
            <Label className="text-default">Functional cookies</Label>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Switch
              checked={performanceAndAnalyticsConsent}
              onCheckedChange={setPerformanceAndAnalyticsConsent}
              id="performance-and-analytics"
            />
            <Label
              className="text-default cursor-pointer"
              htmlFor="performance-and-analytics"
            >
              Performance and analytics cookies
            </Label>
          </Stack>
          <AlertDialogFooter>
            <Stack direction="row" className="w-full gap-2" justify="between">
              <Button
                className="grow"
                variant="outline"
                onClick={onRejectAllClick}
              >
                Reject all
              </Button>
              <Button
                className="grow"
                variant="outline"
                onClick={onAcceptSelectionClick}
              >
                Save selection
              </Button>
              <Button className="grow" onClick={onAcceptAllClick}>
                Accept all
              </Button>
            </Stack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CookieConsentContext.Provider
        value={{ cookieConsent: cookieConsentContext, isTrackingInitialized }}
      >
        {children}
      </CookieConsentContext.Provider>
    </>
  );
};

export default CookieConsentDialog;
