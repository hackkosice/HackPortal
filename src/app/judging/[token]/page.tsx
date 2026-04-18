import React from "react";
import { Metadata } from "next";
import getExternalJudgingByToken from "@/server/getters/judging/getExternalJudgingByToken";
import ExternalJudging from "@/scenes/Judging/ExternalJudging";

export const metadata: Metadata = {
  title: "Judging",
};

const ExternalJudgingPage = async ({
  params: { token },
}: {
  params: { token: string };
}) => {
  const data = await getExternalJudgingByToken(token);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">
          Invalid or expired judging link.
        </p>
      </div>
    );
  }

  return <ExternalJudging data={data} accessToken={token} />;
};

export default ExternalJudgingPage;
