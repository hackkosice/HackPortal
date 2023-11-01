"use client";

import React, { useState } from "react";
import NewVoteParameterDialog from "@/scenes/Dashboard/scenes/VoteParameterManager/components/NewVoteParameterDialog";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

type NewVoteParameterButtonProps = {
  hackathonId: number;
};
const NewVoteParameterButton = ({
  hackathonId,
}: NewVoteParameterButtonProps) => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <>
      <NewVoteParameterDialog
        hackathonId={hackathonId}
        isOpened={isOpened}
        onOpenChange={setIsOpened}
      />
      <Button onClick={() => setIsOpened(true)}>
        <PlusCircleIcon className="h-5 w-5 mr-1" />
        Add new vote parameter
      </Button>
    </>
  );
};

export default NewVoteParameterButton;
