import React from "react";
import getJudgingResults from "@/server/getters/dashboard/judging/getJudgingResults";

type JudgingResultsProps = {
  hackathonId: number;
};
const JudgingResults = async ({ hackathonId }: JudgingResultsProps) => {
  const results = await getJudgingResults(hackathonId);
  return (
    <div>
      Results:{" "}
      <div>
        {results.map((result, index) => {
          return (
            <div key={index}>
              {index + 1}. {result.name} - {result.score}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JudgingResults;
