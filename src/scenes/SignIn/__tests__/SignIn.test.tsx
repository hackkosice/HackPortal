import React from "react";
import { render, screen } from "@testing-library/react";
import SignIn from "@/scenes/SignIn/SignIn";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import userEvent from "@testing-library/user-event";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));
const mockUseSearchParams = useSearchParams as jest.Mock;

describe("SignIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({
      get: () => null,
    });
  });
  it("should render the sign in form", () => {
    render(<SignIn />);
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeVisible();
    expect(screen.getByLabelText("Email")).toBeVisible();
    expect(screen.getByLabelText("Password")).toBeVisible();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Sign in with Github" })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Sign in with Google" })
    ).toBeVisible();

    expect(
      screen.getByRole("link", { name: "Forgot your password?" })
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Sign up here" })).toBeVisible();
  });

  it("should render the sign in form with invalid credentials error", () => {
    mockUseSearchParams.mockReturnValue({
      get: () => "CredentialsSignin",
    });
    render(<SignIn />);
    expect(screen.getByText("Invalid credentials")).toBeVisible();
  });

  it("should render the sign in form with wrong sign in method error", () => {
    mockUseSearchParams.mockReturnValue({
      get: () => "OAuthAccountNotLinked",
    });
    render(<SignIn />);
    expect(screen.getByText("Wrong sign in method")).toBeVisible();
  });

  it("should sign in with email and password", async () => {
    render(<SignIn />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Sign in" });

    await userEvent.type(emailInput, "email@email.com");
    await userEvent.type(passwordInput, "password");
    await userEvent.click(button);

    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      callbackUrl: "/application",
      email: "email@email.com",
      password: "password",
    });
  });

  it("should sign in with Github", async () => {
    render(<SignIn />);
    const button = screen.getByRole("button", { name: "Sign in with Github" });

    await userEvent.click(button);

    expect(mockSignIn).toHaveBeenCalledWith("github", {
      callbackUrl: "/application",
    });
  });

  it("should sign in with Google", async () => {
    render(<SignIn />);
    const button = screen.getByRole("button", { name: "Sign in with Google" });

    await userEvent.click(button);

    expect(mockSignIn).toHaveBeenCalledWith("google", {
      callbackUrl: "/application",
    });
  });
});
