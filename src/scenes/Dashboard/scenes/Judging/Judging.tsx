import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import getMyJudgings from "@/server/getters/dashboard/judging/getMyJudgings";
import JudgingSwitcher from "@/scenes/Dashboard/scenes/Judging/components/JudgingSwitcher";

type JudgingManagerProps = {
  hackathonId: number;
};
const Judging = async ({ hackathonId }: JudgingManagerProps) => {
  const session = await getServerSession(authOptions);
  const { judgings, nextJudgingIndex } = await getMyJudgings(hackathonId);
  return (
    <Card className="md:w-[70vw] mx-auto mb-20 md:[mb-0]">
      <CardHeader>
        <CardTitle>Judging</CardTitle>
      </CardHeader>
      <CardContent>
        {session?.isAdmin && (
          <div className="flex flex-row gap-1">
            <Button>
              <Link href={`/dashboard/${hackathonId}/judging/manage`}>
                Judging manager
              </Link>
            </Button>
            <Button>
              <Link href={`/dashboard/${hackathonId}/judging/results`}>
                Judging results
              </Link>
            </Button>
          </div>
        )}
        <JudgingSwitcher
          judgings={judgings}
          initialJudgingIndex={nextJudgingIndex}
        />
      </CardContent>
    </Card>
  );
};

export default Judging;
