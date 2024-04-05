import React from "react";
import { Metadata } from "next";
import ApplicationReview from "@/scenes/Dashboard/scenes/ApplicationReview/ApplicationReview";
import { disallowVolunteer } from "@/services/helpers/disallowVolunteer";

export const metadata: Metadata = {
  title: "Review applications",
};

const Page = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await disallowVolunteer(hackathonId);
  return <ApplicationReview hackathonId={Number(hackathonId)} />;
};

export default Page;
