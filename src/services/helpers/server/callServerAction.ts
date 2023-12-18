"use server";

import * as Sentry from "@sentry/nextjs";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

type ServerActionReturn<TReturn> =
  | {
      message: string;
      success: true;
      data: TReturn;
    }
  | {
      message: string;
      success: false;
    };

const callServerAction = async <TData, TReturn>(
  action: (data: TData) => Promise<TReturn>,
  data: TData
): Promise<ServerActionReturn<TReturn>> => {
  try {
    const returnedData = await action(data);
    return {
      message: "ok",
      success: true,
      data: returnedData,
    };
  } catch (error) {
    if (error instanceof ExpectedServerActionError) {
      return {
        message: error.message,
        success: false,
      };
    }
    if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true") {
      Sentry.captureException(error);
    }
    return {
      message: "An unexpected error occurred",
      success: false,
    };
  }
};

export default callServerAction;
