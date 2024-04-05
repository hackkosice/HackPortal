import React from "react";
import TravelReimbursementsList from "@/scenes/Dashboard/scenes/TravelReimbursements/TravelReimbursementsList";
import { disallowVolunteer } from "@/services/helpers/disallowVolunteer";

export const metadata = {
  title: "Travel reimbursements",
};
const TravelReimbursementsPage = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await disallowVolunteer(hackathonId);
  return <TravelReimbursementsList hackathonId={Number(hackathonId)} />;
};

export default TravelReimbursementsPage;
