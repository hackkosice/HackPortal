import ApplicationsTable, {
  toCsv,
} from "@/scenes/Dashboard/scenes/ApplicationsList/components/ApplicationsTable";
import { render, screen, waitFor } from "@testing-library/react";
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

const createApplication = (
  id: number,
  properties: { [key: string]: string | null }
) => ({
  id,
  hackerId: id + 100,
  score: {
    score: id,
    numberOfVotes: 1,
    relevance: {
      value: "High",
      color: "#00FF00",
    },
  },
  status: ApplicationStatusEnum.confirmed,
  email: `hacker${id}@email.com`,
  team: "",
  ...properties,
});

const applications = [
  createApplication(1, { "First name": "Alice", School: "TUKE" }),
  createApplication(2, { "First name": "Bob", School: "UPJS" }),
  createApplication(3, { "First name": "Cyril", School: "STU" }),
];
const filters = [
  { column: "First name", options: null },
  { column: "School", options: ["TUKE", "UPJS", "STU", "Other"] },
  { column: "email", options: null },
];

const renderTable = () =>
  render(
    <ApplicationsTable
      hackathonId={1}
      filters={filters}
      applicationProperties={applications}
    />
  );

describe("ApplicationsTable", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should filter by options defined in the application form", async () => {
    renderTable();
    expect(screen.getByText("3 of 3")).toBeVisible();

    await userEvent.click(
      screen.getByRole("button", { name: "Filter School" })
    );
    // Options come from the form, not from the data
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Other" })
    ).toBeVisible();
    await userEvent.click(
      screen.getByRole("menuitemcheckbox", { name: "TUKE" })
    );
    await userEvent.click(
      screen.getByRole("menuitemcheckbox", { name: "UPJS" })
    );

    expect(screen.getByText("2 of 3")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Cyril")).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("menuitemcheckbox", { name: "UPJS" })
    );
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("should filter text columns by contained text", async () => {
    renderTable();

    await userEvent.click(
      screen.getByRole("button", { name: "Filter First name" })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Filter First name value" }),
      "ALI"
    );

    expect(screen.getByText("1 of 3")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should search in all displayed columns", async () => {
    renderTable();
    const search = screen.getByRole("textbox", { name: "Search applications" });

    await userEvent.type(search, "upjs");
    await waitFor(() => expect(screen.getByText("1 of 3")).toBeVisible());
    expect(screen.getByText("Bob")).toBeVisible();

    await userEvent.clear(search);
    await userEvent.type(search, "hacker3@");
    await waitFor(() => expect(screen.getByText("Cyril")).toBeVisible());
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();

    await userEvent.clear(search);
    await userEvent.type(search, "no such value");
    await waitFor(() => expect(screen.getByText("No results.")).toBeVisible());
  });

  it("should search without diacritics and with words in different columns", async () => {
    render(
      <ApplicationsTable
        hackathonId={1}
        filters={filters}
        applicationProperties={[
          ...applications,
          createApplication(4, {
            "First name": "Žofia",
            School: "UPJŠ Košice",
          }),
        ]}
      />
    );
    const search = screen.getByRole("textbox", { name: "Search applications" });

    await userEvent.type(search, "kosice ZOFIA");
    await waitFor(() => expect(screen.getByText("1 of 4")).toBeVisible());
    expect(screen.getByText("Žofia")).toBeVisible();

    await userEvent.clear(search);
    await userEvent.type(search, "kosice alice");
    await waitFor(() => expect(screen.getByText("0 of 4")).toBeVisible());

    await userEvent.clear(search);
    await userEvent.click(
      screen.getByRole("button", { name: "Filter First name" })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Filter First name value" }),
      "zof"
    );
    expect(screen.getByText("1 of 4")).toBeInTheDocument();
  });

  it("should not search in hidden columns", async () => {
    localStorage.setItem(
      "hackathon-1-column-visibility",
      JSON.stringify({ School: false })
    );
    renderTable();

    await userEvent.type(
      screen.getByRole("textbox", { name: "Search applications" }),
      "upjs"
    );
    await waitFor(() => expect(screen.getByText("0 of 3")).toBeVisible());
  });

  it("should clear search and filters", async () => {
    renderTable();
    expect(
      screen.queryByRole("button", { name: "Clear filters" })
    ).not.toBeInTheDocument();

    await userEvent.type(
      screen.getByRole("textbox", { name: "Search applications" }),
      "alice"
    );
    await waitFor(() => expect(screen.getByText("1 of 3")).toBeVisible());

    await userEvent.click(
      screen.getByRole("button", { name: "Clear filters" })
    );
    await waitFor(() => expect(screen.getByText("3 of 3")).toBeVisible());
    expect(
      screen.getByRole("textbox", { name: "Search applications" })
    ).toHaveValue("");
  });

  it("should export filtered rows with visible columns", async () => {
    localStorage.setItem(
      "hackathon-1-column-visibility",
      JSON.stringify({ hackerId: false, team: false })
    );
    renderTable();
    expect(
      screen.getByRole("button", { name: "Download export" })
    ).toBeVisible();

    await userEvent.type(
      screen.getByRole("textbox", { name: "Search applications" }),
      "tuke"
    );
    await waitFor(() => expect(screen.getByText("1 of 3")).toBeVisible());

    const createObjectURL = jest.fn((blob: Blob) => {
      void blob;
      return "blob:url";
    });
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = jest.fn();
    const click = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    await userEvent.click(
      screen.getByRole("button", { name: "Download export" })
    );

    expect(click).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0][0];
    const csv = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsText(blob);
    });
    expect(csv).toBe(
      [
        '"id","score","status","email","First name","School"',
        '"1","1.00","confirmed","hacker1@email.com","Alice","TUKE"',
      ].join("\n")
    );
  });

  it("should escape quotes and formulas in the export", () => {
    expect(toCsv([['say "hi"', "=1+1", "-5", "@x", "a,b"]])).toBe(
      `"say ""hi""","'=1+1","'-5","'@x","a,b"`
    );
  });

  it("should filter applications without an answer", async () => {
    render(
      <ApplicationsTable
        hackathonId={1}
        filters={filters}
        applicationProperties={[
          ...applications,
          createApplication(4, { "First name": "Dana", School: null }),
        ]}
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Filter School" })
    );
    await userEvent.click(
      screen.getByRole("menuitemcheckbox", { name: "(empty)" })
    );

    expect(screen.getByText("1 of 4")).toBeInTheDocument();
    expect(screen.getByText("Dana")).toBeInTheDocument();
  });

  it("should remove the filter of a hidden column", async () => {
    renderTable();
    await userEvent.click(
      screen.getByRole("button", { name: "Filter School" })
    );
    await userEvent.click(
      screen.getByRole("menuitemcheckbox", { name: "TUKE" })
    );
    await userEvent.keyboard("{Escape}");
    expect(screen.getByText("1 of 3")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Columns/ }));
    await userEvent.click(
      screen.getByRole("menuitemcheckbox", { name: "School" })
    );

    expect(screen.getByText("3 of 3")).toBeInTheDocument();
  });

  it("should restore saved status filter", () => {
    localStorage.setItem("hackathon-1-column-filters", "submitted");
    renderTable();
    expect(screen.getByText("0 of 3")).toBeInTheDocument();
  });

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
