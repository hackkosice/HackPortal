import React from "react";

type VoteParameterManagerProps = {
  hackathonId: number;
};
const VoteParameterManager = ({ hackathonId }: VoteParameterManagerProps) => {
  return <>Vote parameter setting for {hackathonId}</>;
};

export default VoteParameterManager;
