import { act, render, screen, waitFor } from "@testing-library/react";
import FormRenderer from "../FormRenderer";
import { Button } from "@/components/ui/button";
import userEvent from "@testing-library/user-event";

const onSubmitMock = jest.fn();
const actionButtons = <Button type="submit">Save</Button>;
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

    act(() => userEvent.click(button));
    expect(onSubmitMock).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByText("This field is required")).toBeVisible()
    );

    act(() => userEvent.type(input, "John"));
    expect(input).toHaveValue("John");

    act(() => userEvent.click(button));
    await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
  });
});
