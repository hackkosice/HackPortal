import React, { Suspense } from "react";
import ApplicationForm from "@/scenes/Application/components/ApplicationForm/ApplicationForm";
import TeamManager from "@/scenes/Application/components/TeamManager/TeamManager";
import { Stack } from "@/components/ui/stack";
import { Heading } from "@/components/ui/heading";
import ReimbursementRequestManager
  from "@/scenes/Application/components/ReimbursementRequestManager/ReimbursementRequestManager";

const Application = () => {
  return (
    <Stack
      direction="column"
      className="mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset w-full gap-20 mb-20 md:mb-40"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ApplicationForm />
      </Suspense>
      <Stack className="flex-col gap-20 md:flex-row w-full md:w-[70vw] mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <TeamManager />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <ReimbursementRequestManager />
        </Suspense>
      </Stack>
    </Stack>
  );
};

export default Application;
