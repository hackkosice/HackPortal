"use client";

import React from "react";
import { VoteParametersData } from "@/server/getters/dashboard/voteParameterManager/voteParameters";
import VoteParameterDisplay from "@/scenes/Dashboard/scenes/ApplicationReview/components/VoteParameterDisplay";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";

type VotePickerProps = {
  voteParameters: VoteParametersData;
  onVoteSubmit: (
    values: {
      voteParameterId: number;
      value: number;
    }[]
  ) => void;
  buttonLabel?: string;
};
const VotePicker = ({
  voteParameters,
  onVoteSubmit,
  buttonLabel,
}: VotePickerProps) => {
  const [selectedValues, setSelectedValues] = React.useState<
    Record<number, number | null>
  >(
    Object.fromEntries(
      voteParameters.map((voteParameter) => [voteParameter.id, null])
    )
  );
  const isVoteValid = Object.values(selectedValues).every(
    (value) => value !== null
  );
  const onSaveClick = async () => {
    if (!isVoteValid) return;
    setSelectedValues(
      Object.fromEntries(
        voteParameters.map((voteParameter) => [voteParameter.id, null])
      )
    );
    const values = Object.entries(selectedValues).map(
      ([voteParameterId, value]) => ({
        voteParameterId: Number(voteParameterId),
        value: value as number,
      })
    );
    onVoteSubmit(values);
  };

  const onValueSelect = (voteParameterId: number, value: number) => {
    setSelectedValues((selectedValues) => ({
      ...selectedValues,
      [voteParameterId]: value,
    }));
  };
  return (
    <Stack direction="column">
      <table>
        <tbody>
          {voteParameters.map((voteParameter) => (
            <VoteParameterDisplay
              key={voteParameter.id}
              voteParameter={voteParameter}
              selectedValue={selectedValues[voteParameter.id]}
              onValueSelect={(value) => onValueSelect(voteParameter.id, value)}
            />
          ))}
        </tbody>
      </table>
      {isVoteValid && (
        <Button onClick={onSaveClick}>{buttonLabel ?? "Save vote"}</Button>
      )}
    </Stack>
  );
};

export default VotePicker;
