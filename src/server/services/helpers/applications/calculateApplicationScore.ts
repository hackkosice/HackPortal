export type CalculateApplicationScoreInput = {
  votes: {
    organizerId: number;
    value: number;
    voteParameter: {
      weight: number;
    };
  }[];
};
const calculateApplicationScore = ({
  votes,
}: CalculateApplicationScoreInput): number => {
  if (votes.length === 0) return 0;
  const organizerScores = votes.reduce(
    (acc, { organizerId, value, voteParameter }) => {
      acc[organizerId] = (acc[organizerId] ?? 0) + value * voteParameter.weight;
      return acc;
    },
    {} as { [key: number]: number }
  );
  return (
    Object.values(organizerScores).reduce((acc, score) => acc + score, 0) /
    Object.values(organizerScores).length
  );
};

export default calculateApplicationScore;
