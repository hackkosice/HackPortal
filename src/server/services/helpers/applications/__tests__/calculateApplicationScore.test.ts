import calculateApplicationScore from "@/server/services/helpers/applications/calculateApplicationScore";

describe("calculateApplicationScore", () => {
  it("should return zero when there are no votes", () => {
    const res = calculateApplicationScore({ votes: [] });
    expect(res.score).toBe(0);
    expect(res.numberOfVotes).toBe(0);
    expect(res.relevance.value).toBe("None");
    expect(res.relevance.color).toBe("rgb(107 114 128)");
  });

  it("should return correct score marked as weak when there are 2 votes", () => {
    const res = calculateApplicationScore({
      votes: [
        {
          organizerId: 1,
          value: 1,
          voteParameter: {
            weight: 1,
          },
        },
        {
          organizerId: 2,
          value: 2,
          voteParameter: {
            weight: 1,
          },
        },
      ],
    });
    expect(res.score).toBe(1.5);
    expect(res.numberOfVotes).toBe(2);
    expect(res.relevance.value).toBe("Weak");
    expect(res.relevance.color).toBe("rgb(239 68 68)");
  });

  it("should return correct score marked as medium when there are 4 votes", () => {
    const res = calculateApplicationScore({
      votes: [
        {
          organizerId: 1,
          value: 1,
          voteParameter: {
            weight: 1,
          },
        },
        {
          organizerId: 2,
          value: 2,
          voteParameter: {
            weight: 1,
          },
        },
        {
          organizerId: 3,
          value: 3,
          voteParameter: {
            weight: 1,
          },
        },
        {
          organizerId: 4,
          value: 4,
          voteParameter: {
            weight: 1,
          },
        },
      ],
    });
    expect(res.score).toBe(2.5);
    expect(res.numberOfVotes).toBe(4);
    expect(res.relevance.value).toBe("Medium");
    expect(res.relevance.color).toBe("rgb(234 179 8)");
  });

  it("should return correct score marked as strong when there are 5 votes", () => {
    const res = calculateApplicationScore({
      votes: [
        {
          organizerId: 1,
          value: 1,
          voteParameter: {
            weight: 1,
          },
        },
        {
          organizerId: 2,
          value: 2,
          voteParameter: {
            weight: 1,
          },
        },
        {
          organizerId: 3,
          value: 3,
          voteParameter: {
            weight: 1,
          },
        },
        {
          organizerId: 4,
          value: 4,
          voteParameter: {
            weight: 1,
          },
        },
        {
          organizerId: 5,
          value: 5,
          voteParameter: {
            weight: 1,
          },
        },
      ],
    });
    expect(res.score).toBe(3);
    expect(res.numberOfVotes).toBe(5);
    expect(res.relevance.value).toBe("Strong");
    expect(res.relevance.color).toBe("rgb(34 197 94)");
  });

  it("should return correct score when there are multiple vote parameters", () => {
    const res = calculateApplicationScore({
      votes: [
        {
          organizerId: 1,
          value: 1,
          voteParameter: {
            weight: 1,
          },
        },
        {
          organizerId: 1,
          value: 2,
          voteParameter: {
            weight: 2,
          },
        },
        {
          organizerId: 2,
          value: 2,
          voteParameter: {
            weight: 1,
          },
        },
        {
          organizerId: 2,
          value: 10,
          voteParameter: {
            weight: 2,
          },
        },
      ],
    });
    expect(res.score).toBe(13.5);
    expect(res.numberOfVotes).toBe(2);
    expect(res.relevance.value).toBe("Weak");
    expect(res.relevance.color).toBe("rgb(239 68 68)");
  });
});
