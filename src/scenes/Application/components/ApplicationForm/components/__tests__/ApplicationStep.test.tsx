import { screen, render } from "@testing-library/react";
import ApplicationStepCard from "../ApplicationStepCard";
import getLocalApplicationDataStepCompleted from "@/services/helpers/localData/getLocalApplicationDataStepCompleted";

jest.mock(
  "../../../../../../services/helpers/localData/getLocalApplicationDataStepCompleted"
);
jest.mock(
  "../../../../../../server/actions/applicationForm/submitApplication",
  () => {
    return jest.fn();
  }
);

const renderComponent = ({
  isCompleted,
  shouldUseLocalIsCompleted,
  isLocalCompleted,
}: {
  isCompleted: boolean;
  shouldUseLocalIsCompleted: boolean;
  isLocalCompleted: boolean;
}) => {
  (getLocalApplicationDataStepCompleted as jest.Mock).mockReturnValue(
    isLocalCompleted
  );
  const step = {
    id: 1,
    position: 1,
    title: "Personal Details",
    isCompleted,
    formFields: [],
  };
  render(
    <ApplicationStepCard step={step} isSignedIn={!shouldUseLocalIsCompleted} />
  );
};

describe("ApplicationStep", () => {
  it("should render the step with the correct text", () => {
    renderComponent({
      isCompleted: false,
      shouldUseLocalIsCompleted: false,
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
      shouldUseLocalIsCompleted: false,
      isLocalCompleted: false,
    });
    expect(
      screen.getByRole("link", { name: "1. Personal Details" })
    ).toBeVisible();
    expect(screen.queryByTestId("Step 1 completed icon")).toBeVisible();
  });

  describe("when shouldUseLocalIsCompleted is true", () => {
    it("should render the step with the correct text and icon when not completed", () => {
      renderComponent({
        isCompleted: false,
        shouldUseLocalIsCompleted: true,
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
        isCompleted: false,
        shouldUseLocalIsCompleted: true,
        isLocalCompleted: true,
      });
      expect(
        screen.getByRole("link", { name: "1. Personal Details" })
      ).toBeVisible();
      expect(screen.queryByTestId("Step 1 completed icon")).toBeVisible();
    });
  });
});
