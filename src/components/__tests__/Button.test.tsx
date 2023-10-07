import { Button } from "@/components/Button";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
describe("Button", () => {
  it("should render the button with the correct text", () => {
    const { getByRole } = render(<Button label="Click me" />);

    expect(getByRole("button", { name: "Click me" })).toBeVisible();
  });

  it("should call onClick callback on button click", () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Button label="Click me" onClick={onClick} />);
    const button = getByRole("button", { name: "Click me" });
    userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should behave as a submit button when type is submit", () => {
    const onClick = jest.fn();
    const onSubmit = jest.fn((e) => e.preventDefault());
    const { getByRole } = render(
      <form onSubmit={onSubmit}>
        <Button label="Click me" onClick={onClick} type="submit" />
      </form>
    );
    const button = getByRole("button", { name: "Click me" });
    userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
  it("should behave as a Link when type is buttonLink", () => {
    const onClick = jest.fn();
    const { getByRole } = render(
      <Button
        label="Click me"
        onClick={onClick}
        type="buttonLink"
        href="/login"
      />
    );
    const button = getByRole("link", { name: "Click me" });
    userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("href", "/login");
  });
});
