import { screen, render, waitFor } from "@testing-library/react";
import ApplicationStepCard from "../ApplicationStepCard";
import getLocalApplicationDataStepCompleted from "@/services/helpers/localData/getLocalApplicationDataStepCompleted";
import submitApplication from "@/server/actions/applicationForm/submitApplication";
import userEvent from "@testing-library/user-event";

jest.mock(
  "@/services/helpers/localData/getLocalApplicationDataStepCompleted",
  () => ({
    __esModule: true,
    default: jest.fn(),
  })
);

jest.mock("@/server/actions/applicationForm/submitApplication", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockSubmitApplication = submitApplication as jest.Mock;

const renderComponent = ({
  isSignedIn = true,
  isCompleted,
  isLocalCompleted,
  isSubmitButton,
}: {
  isSignedIn?: boolean;
  isCompleted: boolean;
  isLocalCompleted: boolean;
  isSubmitButton?: boolean;
}) => {
  (getLocalApplicationDataStepCompleted as jest.Mock).mockReturnValue(
    isLocalCompleted
  );
  const step = isSubmitButton
    ? "submit"
    : {
        id: 1,
        position: 1,
        title: "Personal Details",
        isCompleted,
        formFields: [],
      };
  render(
    <ApplicationStepCard
      step={step}
      isSignedIn={isSignedIn}
      canSubmit={isCompleted && isSignedIn}
    />
  );
};

describe("ApplicationStepCard", () => {
  it("should render the step with the correct text", () => {
    renderComponent({
      isCompleted: false,
      isLocalCompleted: false,
    });
    expect(
      screen.getByRole("link", { name: "1. Personal Details" })
    ).toBeVisible();
    expect(
      screen.queryByTestId("Step 1 completed icon")
    ).not.toBeInTheDocument();
  });

  it("should render the step with the correct text and icon when completed", () => {
    renderComponent({
      isCompleted: true,
      isLocalCompleted: false,
    });
    expect(
      screen.getByRole("link", { name: "1. Personal Details" })
    ).toBeVisible();
    expect(screen.queryByTestId("Step 1 completed icon")).toBeVisible();
  });

  describe("when isSignedIn is false", () => {
    it("should render the step with the correct text and icon when not completed", () => {
      renderComponent({
        isCompleted: false,
        isLocalCompleted: false,
        isSignedIn: false,
      });
      expect(
        screen.getByRole("link", { name: "1. Personal Details" })
      ).toBeVisible();
      expect(
        screen.queryByTestId("Step 1 completed icon")
      ).not.toBeInTheDocument();
    });

    it("should render the step with the correct text and icon when completed", () => {
      renderComponent({
        isCompleted: false,
        isLocalCompleted: true,
        isSignedIn: false,
      });
      expect(
        screen.getByRole("link", { name: "1. Personal Details" })
      ).toBeVisible();
      expect(screen.queryByTestId("Step 1 completed icon")).toBeVisible();
    });
  });

  describe("when isSubmitButton is true", () => {
    it("should render a disabled submit button when not completed", async () => {
      renderComponent({
        isCompleted: false,
        isLocalCompleted: false,
        isSubmitButton: true,
      });
      const submitButton = screen.getByRole("button", {
        name: "Submit application",
      });
      expect(submitButton).toBeVisible();
      expect(submitButton).toBeDisabled();
      await userEvent.hover(submitButton);
      await waitFor(() =>
        expect(
          screen.findAllByText(
            "You need to verify your email to submit your application"
          )
        ).resolves.toBeDefined()
      );
    });

    it("should render a submit button when completed", async () => {
      renderComponent({
        isCompleted: true,
        isLocalCompleted: false,
        isSubmitButton: true,
      });
      const submitButton = screen.getByRole("button", {
        name: "Submit application",
      });
      expect(submitButton).toBeVisible();
      expect(submitButton).not.toBeDisabled();

      await userEvent.click(submitButton);
      expect(
        screen.getByText(
          "Are you sure you want to submit your application? After submitting the application will be locked for changes. You can still join, create and manage your team."
        )
      ).toBeVisible();
      await userEvent.click(screen.getByRole("button", { name: "Yes" }));

      expect(mockSubmitApplication).toHaveBeenCalledTimes(1);
    });
  });
});
