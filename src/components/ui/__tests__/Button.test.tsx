import { Button } from "@/components/ui/button";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Link from "next/link";
describe("Button", () => {
  it("should render the button with the correct text", () => {
    const { getByRole } = render(<Button>Click me</Button>);

    expect(getByRole("button", { name: "Click me" })).toBeVisible();
  });

  it("should call onClick callback on button click", async () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Button onClick={onClick}>Click me</Button>);
    const button = getByRole("button", { name: "Click me" });
    await act(() => userEvent.click(button));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should behave as a submit button when having input as child", async () => {
    const onClick = jest.fn();
    const onSubmit = jest.fn((e) => e.preventDefault());
    const { getByRole } = render(
      <form onSubmit={onSubmit}>
        <Button asChild onClick={onClick}>
          <input type="submit" value="Click me" />
        </Button>
      </form>
    );
    const button = getByRole("button", { name: "Click me" });
    await act(() => userEvent.click(button));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
  it("should behave as a Link when having link as child", async () => {
    const onClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={onClick}>
        <Link href="/signin">Click me</Link>
      </Button>
    );
    const button = getByRole("link", { name: "Click me" });
    await act(() => userEvent.click(button));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("href", "/signin");
  });
});
