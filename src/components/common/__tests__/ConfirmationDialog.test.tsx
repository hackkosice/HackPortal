import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import userEvent from "@testing-library/user-event";

const onAnswerMock = jest.fn();
const mockQuestion = "Are you sure?";

const renderComponent = () => {
  render(
    <ConfirmationDialog question={mockQuestion} onAnswer={onAnswerMock}>
      <Button>open</Button>
    </ConfirmationDialog>
  );
};

describe("ConfirmationDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render", async () => {
    renderComponent();

    expect(screen.queryByText(mockQuestion)).toBeNull();
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("alertdialog")).toBeVisible();
    expect(screen.getByText(mockQuestion)).toBeVisible();

    expect(screen.getByRole("button", { name: "Yes" })).toBeVisible();
    expect(screen.getByRole("button", { name: "No" })).toBeVisible();
  });

  it("should call onAnswer with true when Yes is clicked", async () => {
    renderComponent();

    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("button", { name: "Yes" }));
    expect(onAnswerMock).toHaveBeenCalledWith(true);
  });

  it("should call onAnswer with false when No is clicked", async () => {
    renderComponent();

    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("button", { name: "No" }));
    expect(onAnswerMock).toHaveBeenCalledWith(false);
  });

  it("should open with isManuallyRendered", async () => {
    const { rerender } = render(
      <ConfirmationDialog
        question={mockQuestion}
        onAnswer={onAnswerMock}
        isManuallyOpened={false}
      >
        <Button>open</Button>
      </ConfirmationDialog>
    );

    expect(screen.queryByText(mockQuestion)).toBeNull();

    rerender(
      <ConfirmationDialog
        question={mockQuestion}
        onAnswer={onAnswerMock}
        isManuallyOpened={true}
      >
        <Button>open</Button>
      </ConfirmationDialog>
    );

    expect(screen.getByRole("alertdialog")).toBeVisible();
    expect(screen.getByText(mockQuestion)).toBeVisible();

    expect(screen.getByRole("button", { name: "Yes" })).toBeVisible();
    expect(screen.getByRole("button", { name: "No" })).toBeVisible();
  });
});
