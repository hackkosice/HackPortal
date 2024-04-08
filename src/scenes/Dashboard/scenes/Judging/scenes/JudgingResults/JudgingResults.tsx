import React from "react";
import Link from "next/link";
import { Stack } from "@/components/ui/stack";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import getJudgingResults from "@/server/getters/dashboard/judging/getJudgingResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type JudgingResultsProps = {
  hackathonId: number;
};
const JudgingResults = async ({ hackathonId }: JudgingResultsProps) => {
  const results = await getJudgingResults(hackathonId);
  return (
    <Stack direction="column" className="md:w-[70vw] mx-auto mb-20">
      <Link
        href={`/dashboard/${hackathonId}/judging`}
        className="text-hkOrange"
      >
        <Stack direction="row" alignItems="center" spacing="small">
          <ChevronLeftIcon className="h-5 w-5" />
          Back to judging
        </Stack>
      </Link>
      <Card className="md:w-[70vw] px-5 py-3">
        <CardHeader>
          <CardTitle>Judging results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            {results.map((result, index) => {
              return (
                <div key={index}>
                  <strong>{index + 1}.</strong> {result.name} (
                  {result.tableCode}) - {result.score.toFixed(3)}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default JudgingResults;
