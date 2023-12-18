import { ExpectedServerActionError } from "@/services/types/serverErrors";
import callServerAction from "@/services/helpers/server/callServerAction";
import { captureException } from "@sentry/nextjs";

const originalEnv = process.env;
jest.mock("@sentry/nextjs");

const captureExceptionMock = captureException as jest.Mock;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const functionWithNoData = async () => {};
// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
const functionWithInput = async (data: string) => {};
const functionWithInputAndReturn = async (data: string) => {
  return data;
};
const functionWithReturn = async () => {
  return "test";
};
const functionThatThrowsUnexpected = async () => {
  throw new Error("Test error");
};
const functionThatThrowsExpected = async () => {
  throw new ExpectedServerActionError("Test error");
};
describe("callServerAction", () => {
  afterEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    jest.restoreAllMocks();
  });

  it("should call the function with no data", async () => {
    const res = await callServerAction(functionWithNoData, undefined);
    expect(res).toEqual({
      message: "ok",
      success: true,
    });
  });

  it("should call the function with input", async () => {
    const res = await callServerAction(functionWithInput, "test");
    expect(res).toEqual({
      message: "ok",
      success: true,
    });
  });

  it("should call the function with input and return", async () => {
    const res = await callServerAction(functionWithInputAndReturn, "test");
    expect(res).toEqual({
      message: "ok",
      success: true,
      data: "test",
    });
  });

  it("should call the function with return", async () => {
    const res = await callServerAction(functionWithReturn, undefined);
    expect(res).toEqual({
      message: "ok",
      success: true,
      data: "test",
    });
  });

  it("should call the function that throws unexpected", async () => {
    const res = await callServerAction(functionThatThrowsUnexpected, undefined);
    expect(res).toEqual({
      message: "An unexpected error occurred",
      success: false,
    });

    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it("should call the function that throws expected", async () => {
    const res = await callServerAction(functionThatThrowsExpected, undefined);
    expect(res).toEqual({
      message: "Test error",
      success: false,
    });

    expect(captureExceptionMock).not.toHaveBeenCalled();
  });

  it("should log the error to Sentry when enabled", async () => {
    process.env.NEXT_PUBLIC_SENTRY_ENABLED = "true";
    const res = await callServerAction(functionThatThrowsUnexpected, undefined);
    expect(res).toEqual({
      message: "An unexpected error occurred",
      success: false,
    });

    expect(captureExceptionMock).toHaveBeenCalledTimes(1);
  });
});
