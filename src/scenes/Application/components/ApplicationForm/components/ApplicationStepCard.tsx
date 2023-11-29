"use client";

import React, { useEffect } from "react";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import {
  CheckCircleIcon,
  CursorArrowRaysIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import getLocalApplicationDataStepCompleted from "@/services/helpers/localData/getLocalApplicationDataStepCompleted";
import { ApplicationStepData } from "@/server/getters/application";
import { Card } from "@/components/ui/card";

export type Props = {
  step: ApplicationStepData | "submit";
  shouldUseLocalIsCompleted?: boolean;
};

const ApplicationStepCard = ({
  step,
  shouldUseLocalIsCompleted = false,
}: Props) => {
  const [isCompleted, setIsCompleted] = React.useState(
    step == "submit" ? false : step.isCompleted
  );

  useEffect(() => {
    if (step == "submit") return;
    if (shouldUseLocalIsCompleted) {
      setIsCompleted(getLocalApplicationDataStepCompleted(step));
    } else {
      setIsCompleted(step.isCompleted);
    }
  }, [shouldUseLocalIsCompleted, step]);

  if (step == "submit") {
    return (
      <Card className="w-[95vw] py-5 md:py-0 md:h-[180px] xl:h-[14vw] 2xl:h-[240px] md:w-[10vw] md:rounded-3xl relative bg-hkOrange cursor-pointer">
        <Stack
          justify="center"
          alignItems="center"
          spacing="small"
          className="h-full md:flex-col flex-row"
        >
          <Text className="text-center font-title font-semibold text-xl 2xl:text-2xl text-white">
            Submit application
          </Text>
          <CursorArrowRaysIcon className="w-5 h-5 md:w-10 md:h-10 inline text-white" />
        </Stack>
      </Card>
    );
  }

  return (
    <Link href={`/application/form/step/${step.id}`}>
      <Card
        className={`w-[95vw] py-5 md:py-0 md:h-[180px] xl:h-[14vw] 2xl:h-[240px] md:w-[10vw] md:rounded-3xl relative cursor-pointer hover:bg-slate-200 ${
          isCompleted ? "bg-green-200 hover:bg-green-300" : ""
        }`}
      >
        <Stack
          alignItems="center"
          spacing="small"
          className="h-full md:flex-col flex-row justify-start pl-5 md:pl-0 md:justify-center"
        >
          <Text
            className={`text-center font-title font-semibold text-xl md:text-6xl xl:text-7xl md:absolute md:top-[-20px] md:left-[-20px] ${
              isCompleted ? "text-green-500" : ""
            }`}
          >
            {step.position}.
          </Text>
          <Text className="text-center font-title font-semibold text-xl 2xl:text-2xl">
            {step.title}
          </Text>
          {isCompleted && (
            <span data-testid={`Step ${step.position} completed icon`}>
              <CheckCircleIcon className="w-5 h-5 md:w-10 md:h-10 text-green-600 inline" />
            </span>
          )}
        </Stack>
      </Card>
    </Link>
  );
};
export default ApplicationStepCard;
