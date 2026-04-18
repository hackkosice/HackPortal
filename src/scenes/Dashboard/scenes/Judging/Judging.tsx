import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import getMyJudgings from "@/server/getters/dashboard/judging/getMyJudgings";
import JudgingList from "@/scenes/Dashboard/scenes/Judging/components/JudgingList";
import getOrganizersForJudgingSelector from "@/server/getters/dashboard/judging/getOrganizersForJudgingSelector";
import JudgeSelector from "@/scenes/Dashboard/scenes/Judging/components/JudgeSelector";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

type JudgingProps = {
  hackathonId: number;
  forOrganizerId?: number;
};

const Judging = async ({ hackathonId, forOrganizerId }: JudgingProps) => {
  const session = await getServerSession(authOptions);
  const currentOrganizer = await requireOrganizerSession();
  const { judgings } = await getMyJudgings(hackathonId, forOrganizerId);

  const organizers = session?.isAdmin
    ? await getOrganizersForJudgingSelector()
    : [];

  const activeOrganizerId = forOrganizerId ?? currentOrganizer.id;

  return (
    <Card className="md:w-[70vw] mx-auto mb-20 md:[mb-0]">
      <CardHeader>
        <CardTitle>Judging</CardTitle>
      </CardHeader>
      <CardContent>
        {session?.isAdmin && (
          <>
            <div className="flex flex-row gap-1 flex-wrap mb-4">
              <Button>
                <Link href={`/dashboard/${hackathonId}/judging/manage`}>
                  Judging manager
                </Link>
              </Button>
              <Button>
                <Link href={`/dashboard/${hackathonId}/judging/overview`}>
                  Judging overview
                </Link>
              </Button>
              <Button>
                <Link href={`/dashboard/${hackathonId}/judging/results`}>
                  Judging results
                </Link>
              </Button>
            </div>
            {organizers.length > 0 && activeOrganizerId !== undefined && (
              <JudgeSelector
                organizers={organizers}
                currentOrganizerId={activeOrganizerId}
                basePath={`/dashboard/${hackathonId}/judging`}
              />
            )}
          </>
        )}
        <JudgingList judgings={judgings} />
      </CardContent>
    </Card>
  );
};

export default Judging;
