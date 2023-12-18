import { render, screen } from "@testing-library/react";
import ApplicationFormStep from "@/scenes/ApplicationFormStep/ApplicationFormStep";
import saveApplicationStepForm from "@/server/actions/applicationForm/saveApplicationStepForm";
import updateLocalApplicationData from "@/services/helpers/localData/updateLocalApplicationData";
import userEvent from "@testing-library/user-event";

jest.mock("@/server/actions/applicationForm/saveApplicationStepForm", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockSaveApplicationStepForm = saveApplicationStepForm as jest.Mock;

jest.mock("@/services/helpers/localData/updateLocalApplicationData", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockUpdateLocalApplicationData = updateLocalApplicationData as jest.Mock;
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

const renderComponent = ({
  signedIn = true,
  previousStepId = 1,
  nextStepId = 3,
}: {
  signedIn?: boolean;
  previousStepId?: number | null;
  nextStepId?: number | null;
} = {}) => {
  render(
    <ApplicationFormStep
      stepId={2}
      data={{
        data: {
          title: "test step",
          position: 1,
          description: "test description",
          formFields: [
            {
              id: 1,
              label: "test label",
              type: "text",
              required: true,
              description: "test description",
              position: 1,
              name: "test name",
              initialValue: "test initial value",
              formFieldVisibilityRule: null,
              fileUploadKey: null,
              optionList: undefined,
            },
          ],
          nextStepId,
          previousStepId,
        },
        signedIn,
      }}
    />
  );
};

describe("ApplicationFormStep", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    renderComponent();
    expect(screen.getByRole("heading", { name: "1. test step" })).toBeVisible();
    expect(screen.getByText("test description")).toBeVisible();

    expect(screen.getByRole("link", { name: "Previous step" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Previous step" })).toHaveAttribute(
      "href",
      "/application/form/step/1"
    );
    expect(
      screen.getByRole("button", { name: "Save and continue" })
    ).toBeVisible();

    expect(screen.getByRole("textbox", { name: "test label" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "test label" })).toHaveValue(
      "test initial value"
    );
  });

  it("should submit form if signed in", async () => {
    renderComponent();
    const input = screen.getByRole("textbox", { name: "test label" });
    await userEvent.clear(input);
    await userEvent.type(input, "test value");
    await userEvent.click(
      screen.getByRole("button", { name: "Save and continue" })
    );
    expect(mockSaveApplicationStepForm).toHaveBeenCalledWith({
      stepId: 2,
      fieldValues: [
        {
          fieldId: 1,
          fieldType: "text",
          value: "test value",
        },
      ],
    });
    expect(mockUpdateLocalApplicationData).not.toHaveBeenCalled();
  });

  it("should save data locally if not signed in", async () => {
    renderComponent({
      signedIn: false,
    });
    const input = screen.getByRole("textbox", { name: "test label" });
    await userEvent.clear(input);
    await userEvent.type(input, "test value");
    await userEvent.click(
      screen.getByRole("button", { name: "Save and continue" })
    );
    expect(mockSaveApplicationStepForm).not.toHaveBeenCalled();
    expect(mockUpdateLocalApplicationData).toHaveBeenCalledWith({
      stepId: 2,
      fieldValues: [
        {
          fieldId: 1,
          fieldType: "text",
          value: "test value",
        },
      ],
    });
  });

  it("should not render previous step link if no previous step", () => {
    renderComponent({ previousStepId: null });
    expect(screen.queryByRole("link", { name: "Previous step" })).toBeNull();
  });

  it("should not render continue button if no next step", () => {
    renderComponent({ nextStepId: null });
    expect(screen.getByRole("button", { name: "Save" })).toBeVisible();
  });
});
