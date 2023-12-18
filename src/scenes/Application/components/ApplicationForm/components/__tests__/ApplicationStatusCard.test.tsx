import { render, screen } from "@testing-library/react";
import ApplicationStatusCard from "@/scenes/Application/components/ApplicationForm/components/ApplicationStatusCard";
import {
  ApplicationStatus,
  ApplicationStatusEnum,
} from "@/services/types/applicationStatus";
import confirmAttendance from "@/server/actions/applicationForm/confirmAttendance";
import userEvent from "@testing-library/user-event";

jest.mock("@/server/actions/applicationForm/confirmAttendance", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockConfirmAttendance = confirmAttendance as jest.Mock;

const renderComponent = (status: ApplicationStatus) => {
  render(<ApplicationStatusCard status={status} />);
};
describe("ApplicationStatusCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it.each([
    [
      ApplicationStatusEnum.open,
      "Please fill in all of the required steps below.",
    ],
    [
      ApplicationStatusEnum.submitted,
      "Your application has been submitted. You can still join, create and manage your team. We will let you know about the results of the selection process.",
    ],
    [
      ApplicationStatusEnum.invited,
      "Congratulations, You have been invited! Confirm your attendance by clicking the button below.",
    ],
    [
      ApplicationStatusEnum.confirmed,
      "Your attendance is confirmed. We are looking forward to seeing you at the event!",
    ],
    [
      ApplicationStatusEnum.declined,
      "We are sorry to hear that you cannot attend. We hope to see you next time!",
    ],
    [
      ApplicationStatusEnum.rejected,
      "Unfortunately, we cannot accept your application. If you have any questions, please contact us.",
    ],
    [
      ApplicationStatusEnum.attended,
      "Thank you for attending our event! We hope you had a great time.",
    ],
  ])("should render correctly for %s status", (status, text) => {
    renderComponent(status);
    expect(mockConfirmAttendance).not.toHaveBeenCalled();
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("should render correctly for invited status", async () => {
    renderComponent(ApplicationStatusEnum.invited);
    expect(mockConfirmAttendance).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Confirm attendance" })
    ).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "Confirm attendance" })
    );
    expect(mockConfirmAttendance).toHaveBeenCalledTimes(1);
  });
});
