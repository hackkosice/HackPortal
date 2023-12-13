import React from "react";
import { Metadata } from "next";
import CheckinScanner from "@/scenes/Dashboard/scenes/CheckInScanner/CheckinScanner";

export const metadata: Metadata = {
  title: "Checkin",
};

const Page = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  return <CheckinScanner hackathonId={Number(hackathonId)} />;
};

export default Page;
