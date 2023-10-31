import React from "react";
import { Metadata } from "next";
import VoteParameterManager from "@/scenes/Dashboard/scenes/VoteParameterManager/VoteParameterManager";

export const metadata: Metadata = {
  title: "Settings | Vote parameters",
};

const Page = ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  return <VoteParameterManager hackathonId={Number(hackathonId)} />;
};

export default Page;
