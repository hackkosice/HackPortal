import React from "react";
import { VoteParameter } from "@/server/getters/dashboard/voteParameterManager/voteParameters";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/common/Tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

type VoteParameterDisplayProps = {
  voteParameter: VoteParameter;
  selectedValue: number | null;
  onValueSelect: (value: number) => void;
};
const VoteParameterDisplay = ({
  voteParameter: { name, minValue, maxValue, description },
  selectedValue,
  onValueSelect,
}: VoteParameterDisplayProps) => {
  const possibleValues = Array.from(
    { length: maxValue - minValue + 1 },
    (_, i) => i + minValue
  );
  return (
    <tr>
      <td className="md:pr-2 pr-1">
        {description && (
          <Tooltip
            trigger={
              <InformationCircleIcon className="w-5 h-5 text-hkOrange cursor-pointer" />
            }
            content={description}
          />
        )}
      </td>
      <td className="md:pr-2 pr-1">
        <Stack direction="row" spacing="none" alignItems="center">
          {name}:
        </Stack>
      </td>
      <td className="py-1">
        <Stack direction="row" spacing="none">
          {possibleValues.map((value) => (
            <Button
              key={value}
              size="icon"
              variant="unstyled"
              className={`border-2 text-hkOrange border-primaryButton bg-white md:px-4 px-2.5 py-1 md:py-2 h-fit w-fit rounded-none border-r-0 ${
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
      </td>
    </tr>
  );
};

export default VoteParameterDisplay;
