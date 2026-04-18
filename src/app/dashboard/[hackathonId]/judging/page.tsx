import React from "react";
import { Metadata } from "next";
import requireOrganizer from "@/services/helpers/requireOrganizer";
import Judging from "@/scenes/Dashboard/scenes/Judging/Judging";
import { disallowVolunteer } from "@/services/helpers/disallowVolunteer";

export const metadata: Metadata = {
  title: "Judging",
};

const Page = async ({
  params: { hackathonId },
  searchParams,
}: {
  params: { hackathonId: string };
  searchParams: { forOrganizer?: string };
}) => {
  await disallowVolunteer(hackathonId);
  await requireOrganizer();
  const forOrganizerId = searchParams.forOrganizer
    ? Number(searchParams.forOrganizer)
    : undefined;
  return (
    <Judging
      hackathonId={Number(hackathonId)}
      forOrganizerId={forOrganizerId}
    />
  );
};

export default Page;
