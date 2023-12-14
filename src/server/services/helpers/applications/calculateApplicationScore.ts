export type CalculateApplicationScoreInput = {
  votes: {
    organizerId: number;
    value: number;
    voteParameter: {
      weight: number;
    };
  }[];
};

type ApplicationScoreRelevance = {
  value: string;
  color: string;
};

export type ApplicationScore = {
  score: number;
  numberOfVotes: number;
  relevance: ApplicationScoreRelevance;
};

const calculateRelevance = (
  numberOfVotes: number
): ApplicationScoreRelevance => {
  if (numberOfVotes === 0) {
    return {
      value: "None",
      color: "rgb(107 114 128)",
    };
  }
  if (numberOfVotes <= 2) {
    return {
      value: "Weak",
      color: "rgb(239 68 68)",
    };
  }
  if (numberOfVotes <= 4) {
    return {
      value: "Medium",
      color: "rgb(234 179 8)",
    };
  }
  return {
    value: "Strong",
    color: "rgb(34 197 94)",
  };
};
const calculateApplicationScore = ({
  votes,
}: CalculateApplicationScoreInput): ApplicationScore => {
  if (votes.length === 0)
    return {
      score: 0,
      numberOfVotes: 0,
      relevance: calculateRelevance(0),
    };
  const organizerScores = votes.reduce(
    (acc, { organizerId, value, voteParameter }) => {
      acc[organizerId] = (acc[organizerId] ?? 0) + value * voteParameter.weight;
      return acc;
    },
    {} as { [key: number]: number }
  );
  const numberOfVotes = Object.values(organizerScores).length;
  return {
    score:
      Object.values(organizerScores).reduce((acc, score) => acc + score, 0) /
      numberOfVotes,
    numberOfVotes,
    relevance: calculateRelevance(numberOfVotes),
  };
};

export default calculateApplicationScore;
