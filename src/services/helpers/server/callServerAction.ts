"use server";

import * as Sentry from "@sentry/nextjs";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

type ServerActionReturn = {
  message: string;
  success: boolean;
};

const callServerAction = async <TData, TReturn>(
  action: (data: TData) => Promise<TReturn>,
  data: TData
): Promise<ServerActionReturn> => {
  try {
    await action(data);
    return {
      message: "ok",
      success: true,
    };
  } catch (error) {
    if (error instanceof ExpectedServerActionError) {
      return {
        message: error.message,
        success: false,
      };
    }
    if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
      console.log("Sentry error", error);
      Sentry.captureException(error);
    }
    return {
      message: "An unexpected error occurred",
      success: false,
    };
  }
};

export default callServerAction;
