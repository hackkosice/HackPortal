import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getSponsorJudgings from "@/server/getters/sponsors/getSponsorJudgings";
import SponsorJudgingSwitcher from "./SponsorJudgingSwitcher";

const SponsorJudging = async () => {
  const { judgings, nextJudgingIndex } = await getSponsorJudgings();

  return (
    <Card className="mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset mx-auto">
      <CardHeader>
        <CardTitle>Judging</CardTitle>
      </CardHeader>
      <CardContent>
        {judgings.length === 0 ? (
          <p className="text-muted-foreground">No judging assignments yet.</p>
        ) : (
          <SponsorJudgingSwitcher
            judgings={judgings}
            initialJudgingIndex={nextJudgingIndex}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SponsorJudging;
