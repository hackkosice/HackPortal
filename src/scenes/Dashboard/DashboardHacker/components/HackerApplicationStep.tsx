import React from "react";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export type Props = {
  stepId: number;
  stepNumber: number;
  title: string;
  isCompleted: boolean;
};

const HackerApplicationStep = ({
  stepId,
  stepNumber,
  title,
  isCompleted,
}: Props) => {
  return (
    <Link href={`/form/step/${stepId}`} className="w-1/2">
      <div
        className={`border-2 p-4 rounded-md ${
          isCompleted ? "border-green-500" : "border-hkOrange"
        }`}
      >
        <Stack alignItems="center" spacing="small">
          <Text>
            {stepNumber}. {title}
          </Text>
          {isCompleted && (
            <CheckCircleIcon className="w-5 h-5 text-green-500 inline" />
          )}
        </Stack>
      </div>
    </Link>
  );
};
export default HackerApplicationStep;
