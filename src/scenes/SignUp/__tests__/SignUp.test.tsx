import { signIn } from "next-auth/react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import SignUp from "@/scenes/SignUp/SignUp";
import signUp from "@/server/actions/signUp";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;

jest.mock("@/server/actions/signUp", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockSignUp = signUp as jest.MockedFunction<typeof signUp>;

describe("SignUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render the sign up form", () => {
    render(<SignUp />);
    expect(screen.getByRole("heading", { name: "Sign Up" })).toBeVisible();

    expect(screen.getByLabelText("Email")).toBeVisible();
    expect(screen.getByLabelText("Password")).toBeVisible();
    expect(screen.getByLabelText("Repeat password")).toBeVisible();

    expect(
      screen.getByRole("button", { name: "Sign up with email and password" })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Sign up with Github" })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Sign up with Google" })
    ).toBeVisible();

    expect(screen.getByRole("link", { name: "Sign in here" })).toBeVisible();
  });

  it("should sign up with email and password", async () => {
    render(<SignUp />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const repeatPasswordInput = screen.getByLabelText("Repeat password");

    await userEvent.type(emailInput, "email@gmail.com");

    await userEvent.type(passwordInput, "pass");
    await userEvent.click(
      screen.getByRole("button", { name: "Sign up with email and password" })
    );
    expect(
      screen.getByText("Password must be at least 8 characters long")
    ).toBeVisible();

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, "password");
    await userEvent.click(
      screen.getByRole("button", { name: "Sign up with email and password" })
    );
    expect(
      screen.getByText("Password must contain at least one uppercase letter")
    ).toBeVisible();

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, "Password");
    await userEvent.click(
      screen.getByRole("button", { name: "Sign up with email and password" })
    );
    expect(
      screen.getByText("Password must contain at least one number")
    ).toBeVisible();

    await userEvent.type(passwordInput, "Password1");
    await userEvent.click(
      screen.getByRole("button", { name: "Sign up with email and password" })
    );
    expect(
      screen.getByText("Password must contain at least one special character")
    ).toBeVisible();

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, "Password1!");
    await userEvent.click(
      screen.getByRole("button", { name: "Sign up with email and password" })
    );
    expect(screen.getByText("Passwords do not match")).toBeVisible();

    await userEvent.type(repeatPasswordInput, "Password1!");

    expect(signUp).not.toHaveBeenCalled();
    await userEvent.click(
      screen.getByRole("button", { name: "Sign up with email and password" })
    );
    expect(signUp).toHaveBeenCalledWith({
      email: "email@gmail.com",
      password: "Password1!",
    });
    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      callbackUrl: "/application",
      email: "email@gmail.com",
      password: "Password1!",
    });
  });

  it("should sign up with Github", async () => {
    render(<SignUp />);
    const button = screen.getByRole("button", { name: "Sign up with Github" });

    await userEvent.click(button);

    expect(mockSignIn).toHaveBeenCalledWith("github", {
      callbackUrl: "/application",
    });
  });

  it("should sign up with Google", async () => {
    render(<SignUp />);
    const button = screen.getByRole("button", { name: "Sign up with Google" });

    await userEvent.click(button);

    expect(mockSignIn).toHaveBeenCalledWith("google", {
      callbackUrl: "/application",
    });
  });

  it("should render the sign up form with expected error from signup", async () => {
    mockSignUp.mockImplementation(() => {
      throw new ExpectedServerActionError("User already exists");
    });
    render(<SignUp />);

    await userEvent.type(screen.getByLabelText("Email"), "email@email.com");
    await userEvent.type(screen.getByLabelText("Password"), "Password1!");
    await userEvent.type(
      screen.getByLabelText("Repeat password"),
      "Password1!"
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Sign up with email and password" })
    );

    expect(screen.getByText("User already exists")).toBeVisible();
  });
});
