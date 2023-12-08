import React from "react";
import TravelReimbursementsList from "@/scenes/Dashboard/scenes/TravelReimbursements/TravelReimbursementsList";

export const metadata = {
  title: "Travel reimbursements",
};
const TravelReimbursementsPage = ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  return <TravelReimbursementsList hackathonId={Number(hackathonId)} />;
};

export default TravelReimbursementsPage;
