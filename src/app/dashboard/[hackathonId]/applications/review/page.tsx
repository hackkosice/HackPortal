import React from "react";
import { Metadata } from "next";
import ApplicationReview from "@/scenes/Dashboard/scenes/ApplicationReview/ApplicationReview";

export const metadata: Metadata = {
  title: "Review applications",
};

const Page = ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  return <ApplicationReview hackathonId={Number(hackathonId)} />;
};

export default Page;
