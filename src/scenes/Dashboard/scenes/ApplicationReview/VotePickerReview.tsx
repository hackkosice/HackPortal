"use client";

import React from "react";
import addVote from "@/server/actions/dashboard/addVote";
import VotePicker from "@/scenes/Dashboard/scenes/ApplicationReview/components/VotePicker";
import { VoteParametersData } from "@/server/getters/dashboard/voteParameterManager/voteParameters";

type VotePickerReviewProps = {
  voteParameters: VoteParametersData;
  applicationId: number;
};
const VotePickerReview = ({
  voteParameters,
  applicationId,
}: VotePickerReviewProps) => {
  return (
    <VotePicker
      voteParameters={voteParameters}
      onVoteSubmit={async (values) => {
        await addVote({
          applicationId,
          values,
        });
      }}
    />
  );
};

export default VotePickerReview;
