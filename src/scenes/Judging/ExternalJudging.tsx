import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalJudgingData } from "@/server/getters/judging/getExternalJudgingByToken";
import ExternalJudgingList from "./ExternalJudgingList";

type ExternalJudgingProps = {
  data: ExternalJudgingData;
  accessToken: string;
};

const ExternalJudging = ({ data, accessToken }: ExternalJudgingProps) => {
  return (
    <Card className="mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Judging — {data.hackathonName}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Welcome, <strong>{data.judgeName}</strong>
        </p>
      </CardHeader>
      <CardContent>
        <ExternalJudgingList
          teamJudgings={data.teamJudgings}
          accessToken={accessToken}
        />
      </CardContent>
    </Card>
  );
};

export default ExternalJudging;
