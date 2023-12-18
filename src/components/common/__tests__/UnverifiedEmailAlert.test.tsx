import React from "react";
import { render, screen } from "@testing-library/react";
import UnverifiedEmailAlert from "@/components/common/UnverifiedEmailAlert";
import { useToast } from "@/components/ui/use-toast";
import resendVerificationLink from "@/server/actions/auth/resendVerificationLink";
import userEvent from "@testing-library/user-event";

jest.mock("@/server/actions/auth/resendVerificationLink", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockResendVerificationLink =
  resendVerificationLink as jest.MockedFunction<typeof resendVerificationLink>;

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}));
const mockUseToast = useToast as jest.Mock;
const toastMock = jest.fn();
mockUseToast.mockReturnValue({
  toast: toastMock,
});

describe("UnverifiedEmailAlert", () => {
  it("should render correct content", () => {
    render(<UnverifiedEmailAlert />);
    expect(screen.getByText("You have unverified email!")).toBeVisible();
    expect(
      screen.getByText(
        /Please check link in your email to verify your email address/
      )
    ).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: "Resend email with verification link",
      })
    ).toBeVisible();
  });

  it("should call resendVerificationLink on button click", async () => {
    mockResendVerificationLink.mockResolvedValueOnce(undefined);
    render(<UnverifiedEmailAlert />);
    await userEvent.click(
      screen.getByRole("button", {
        name: "Resend email with verification link",
      })
    );
    expect(mockResendVerificationLink).toHaveBeenCalledTimes(1);
    expect(toastMock).toHaveBeenCalledWith({
      title: "Email sent!",
      description: "We've sent you an email with verification link.",
    });
  });
});
