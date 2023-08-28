"use client";

import React, { useEffect } from "react";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import getLocalApplicationDataStepCompleted from "@/services/helpers/localData/getLocalApplicationDataStepCompleted";
import { ApplicationStepData } from "@/server/getters/application";

export type Props = {
  step: ApplicationStepData;
  shouldUseLocalIsCompleted: boolean;
};

const ApplicationStep = ({ step, shouldUseLocalIsCompleted }: Props) => {
  const [isCompleted, setIsCompleted] = React.useState(step.isCompleted);

  useEffect(() => {
    if (shouldUseLocalIsCompleted) {
      setIsCompleted(getLocalApplicationDataStepCompleted(step));
    } else {
      setIsCompleted(step.isCompleted);
    }
  }, [shouldUseLocalIsCompleted, step]);

  return (
    <Link href={`/application/form/step/${step.id}`} className="w-1/2">
      <div
        className={`border-2 p-4 rounded-md ${
          isCompleted ? "border-green-500" : "border-hkOrange"
        }`}
      >
        <Stack alignItems="center" spacing="small">
          <Text>
            {step.stepNumber}. {step.title}
          </Text>
          {isCompleted && (
            <CheckCircleIcon className="w-5 h-5 text-green-500 inline" />
          )}
        </Stack>
      </div>
    </Link>
  );
};
export default ApplicationStep;