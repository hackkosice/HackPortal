import { render, screen, waitFor } from "@testing-library/react";
import FormRenderer from "../FormRenderer";
import { Button } from "@/components/ui/button";
import userEvent from "@testing-library/user-event";

const onSubmitMock = jest.fn();
const actionButtons = <Button type="submit">Save</Button>;

window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.HTMLElement.prototype.hasPointerCapture = jest.fn();

describe("FormRenderer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should render simple form with a text field", async () => {
    render(
      <FormRenderer
        formFields={[
          {
            id: 1,
            position: 1,
            name: "name",
            label: "Name",
            type: "text",
            required: true,
            initialValue: "",
            optionList: [],
            description: "",
            formFieldVisibilityRule: null,
          },
        ]}
        onSubmit={onSubmitMock}
        actionButtons={actionButtons}
      />
    );

    const input = screen.getByLabelText("Name");
    const button = screen.getByRole("button", { name: "Save" });
    expect(input).toBeVisible();
    expect(button).toBeVisible();

    await userEvent.click(button);
    expect(onSubmitMock).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByText("This field is required")).toBeVisible()
    );

    await userEvent.type(input, "John");
    expect(input).toHaveValue("John");

    await userEvent.click(button);
    await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
  });

  it("hides the field when the visibility rule is not met", async () => {
    render(
      <FormRenderer
        formFields={[
          {
            id: 1,
            position: 1,
            name: "targetField",
            label: "Target field",
            type: "select",
            required: true,
            initialValue: "",
            optionList: [
              {
                value: "1",
                label: "Option 1",
              },
              {
                value: "2",
                label: "Option 2",
              },
            ],
            description: "",
            formFieldVisibilityRule: null,
          },
          {
            id: 2,
            position: 2,
            name: "hiddenField",
            label: "Hidden field",
            type: "textarea",
            required: false,
            initialValue: "",
            optionList: [],
            description: "",
            formFieldVisibilityRule: {
              targetOptionId: 2,
              targetFormFieldName: "targetField",
            },
          },
        ]}
        onSubmit={onSubmitMock}
        actionButtons={actionButtons}
      />
    );

    expect(screen.getByLabelText("Target field")).toBeVisible();
    expect(screen.queryByLabelText("Hidden field")).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("combobox", { name: "Target field" })
    );

    await userEvent.click(screen.getByRole("option", { name: "Option 2" }));

    expect(screen.getByLabelText("Hidden field")).toBeVisible();
  });
});
