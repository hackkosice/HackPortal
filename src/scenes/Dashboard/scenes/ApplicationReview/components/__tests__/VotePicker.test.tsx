import React from "react";
import VotePicker from "@/scenes/Dashboard/scenes/ApplicationReview/components/VotePicker";
import { render, screen } from "@testing-library/react";
import addVote from "@/server/actions/dashboard/addVote";
import userEvent from "@testing-library/user-event";

jest.mock("@/server/actions/dashboard/addVote", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockAddVote = addVote as jest.MockedFunction<typeof addVote>;

describe("VotePicker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render when no vote parameters are defined", () => {
    render(<VotePicker voteParameters={[]} applicationId={1} />);
    expect(true).toBe(true);
  });

  it("should render when vote parameter is defined", () => {
    render(
      <VotePicker
        voteParameters={[
          {
            id: 1,
            name: "test parameter",
            description: "test",
            minValue: 1,
            maxValue: 5,
            weight: 1,
          },
        ]}
        applicationId={1}
      />
    );

    expect(screen.getByText("test parameter:")).toBeVisible();
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole("button", { name: i.toString() })).toBeVisible();
    }
  });

  it("should render when multiple vote parameters are defined", async () => {
    render(
      <VotePicker
        voteParameters={[
          {
            id: 1,
            name: "test parameter",
            description: "test",
            minValue: 1,
            maxValue: 6,
            weight: 1,
          },
          {
            id: 2,
            name: "test parameter 2",
            description: "test",
            minValue: -2,
            maxValue: 3,
            weight: 1,
          },
        ]}
        applicationId={1}
      />
    );

    expect(screen.getByText("test parameter:")).toBeVisible();
    expect(screen.getByText("test parameter 2:")).toBeVisible();
    for (let i = 1; i <= 3; i++) {
      expect(
        await screen.findAllByRole("button", { name: i.toString() })
      ).toHaveLength(2);
    }
    for (let i = 4; i <= 6; i++) {
      expect(screen.getByRole("button", { name: i.toString() })).toBeVisible();
    }
    for (let i = -2; i <= 0; i++) {
      expect(screen.getByRole("button", { name: i.toString() })).toBeVisible();
    }
  });

  it("should call addVote when a value is selected", async () => {
    render(
      <VotePicker
        voteParameters={[
          {
            id: 1,
            name: "test parameter",
            description: "test",
            minValue: 1,
            maxValue: 6,
            weight: 1,
          },
        ]}
        applicationId={1}
      />
    );

    await screen.findByText("test parameter:");
    expect(screen.queryByRole("button", { name: "Save vote" })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "1" }));
    expect(screen.getByRole("button", { name: "Save vote" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Save vote" }));
    expect(mockAddVote).toHaveBeenCalledWith({
      applicationId: 1,
      values: [
        {
          value: 1,
          voteParameterId: 1,
        },
      ],
    });
  });
});
