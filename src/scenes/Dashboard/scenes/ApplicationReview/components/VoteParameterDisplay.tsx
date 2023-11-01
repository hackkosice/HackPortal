import React from "react";
import { VoteParameter } from "@/server/getters/dashboard/voteParameterManager/voteParameters";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

type VoteParameterDisplayProps = {
  voteParameter: VoteParameter;
  selectedValue: number | null;
  onValueSelect: (value: number) => void;
};
const VoteParameterDisplay = ({
  voteParameter: { name, minValue, maxValue },
  selectedValue,
  onValueSelect,
}: VoteParameterDisplayProps) => {
  const possibleValues = Array.from(
    { length: maxValue - minValue + 1 },
    (_, i) => i + minValue
  );
  return (
    <Stack direction="row" alignItems="center">
      <Text>{name}:</Text>
      <Stack direction="row" spacing="none">
        {possibleValues.map((value) => (
          <Button
            key={value}
            size="icon"
            variant="unstyled"
            className={`border-2 text-hkOrange border-primaryButton bg-white px-4 py-2 h-fit w-fit rounded-none border-r-0 ${
              value === maxValue ? "rounded-r border-r-1" : ""
            } ${value === minValue ? "rounded-l" : ""} ${
              selectedValue !== null && value <= selectedValue
                ? "bg-slate-500 text-white"
                : ""
            }`}
            onClick={() => onValueSelect(value)}
          >
            {value}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

export default VoteParameterDisplay;
