import ApplicationsTable from "@/scenes/Dashboard/scenes/ApplicationsList/components/ApplicationsTable";
import { render, screen } from "@testing-library/react";
import inviteHacker from "@/server/actions/dashboard/inviteHacker";
import rejectHacker from "@/server/actions/dashboard/rejectHacker";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";
import userEvent from "@testing-library/user-event";

jest.mock("@/server/actions/dashboard/inviteHacker", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockInviteHacker = inviteHacker as jest.Mock;

jest.mock("@/server/actions/dashboard/rejectHacker", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockRejectHacker = rejectHacker as jest.Mock;

describe("ApplicationsTable", () => {
  it("should render correctly", () => {
    render(<ApplicationsTable hackathonId={1} applicationProperties={[]} />);
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("should render correctly with open application", () => {
    const applicationProperties = [
      {
        id: 123,
        hackerId: 456,
        score: {
          score: 0,
          numberOfVotes: 0,
          relevance: {
            value: "No",
            color: "#FF0000",
          },
        },
        status: ApplicationStatusEnum.open,
        email: "test@email.com",
        firstName: "test first name",
        lastName: "test last name",
        team: "test team",
      },
    ];
    render(
      <ApplicationsTable
        hackathonId={1}
        applicationProperties={applicationProperties}
      />
    );
    expect(screen.getByText("id")).toBeVisible();
    expect(screen.getByText("hackerId")).toBeVisible();
    expect(screen.getByText("firstName")).toBeVisible();
    expect(screen.getByText("lastName")).toBeVisible();
    expect(screen.getByText("team")).toBeVisible();
    expect(screen.getByText("score")).toBeVisible();
    expect(screen.getByText("status")).toBeVisible();
    expect(screen.getByRole("cell", { name: "test first name" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "test last name" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "test team" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "open" })).toBeVisible();

    expect(screen.getByRole("link", { name: "Details" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "href",
      "applications/123/detail"
    );

    expect(
      screen.queryByRole("button", { name: "Invite" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Reject" })
    ).not.toBeInTheDocument();
  });

  it("should render correctly with submitted application", async () => {
    const applicationProperties = [
      {
        id: 123,
        hackerId: 456,
        score: {
          score: 0,
          numberOfVotes: 0,
          relevance: {
            value: "No",
            color: "#FF0000",
          },
        },
        status: ApplicationStatusEnum.submitted,
        email: "test email",
        firstName: "test first name",
        lastName: "test last name",
        team: "test team",
      },
    ];
    render(
      <ApplicationsTable
        hackathonId={1}
        applicationProperties={applicationProperties}
      />
    );

    expect(screen.getByRole("button", { name: "Invite" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Reject" })).toBeVisible();

    await userEvent.click(screen.getByRole("button", { name: "Invite" }));
    expect(
      screen.getByText('Are you sure you want to invite hacker "test email"?')
    ).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Yes" }));
    expect(mockInviteHacker).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("button", { name: "Reject" }));
    expect(
      screen.getByText('Are you sure you want to reject hacker "test email"?')
    ).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Yes" }));
    expect(mockRejectHacker).toHaveBeenCalledTimes(1);
  });
});
