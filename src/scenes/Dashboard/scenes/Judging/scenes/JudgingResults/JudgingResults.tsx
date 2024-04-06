import React from "react";
import Link from "next/link";
import { Stack } from "@/components/ui/stack";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import getJudgingResults from "@/server/getters/dashboard/judging/getJudgingResults";

type JudgingResultsProps = {
  hackathonId: number;
};
const JudgingResults = async ({ hackathonId }: JudgingResultsProps) => {
  const results = await getJudgingResults(hackathonId);
  return (
    <div>
      <Link
        href={`/dashboard/${hackathonId}/judging`}
        className="text-hkOrange"
      >
        <Stack direction="row" alignItems="center" spacing="small">
          <ChevronLeftIcon className="h-5 w-5" />
          Back to judging
        </Stack>
      </Link>
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
