import React, { Suspense } from "react";
import ApplicationFormSteps from "@/scenes/Application/components/ApplicationForm/ApplicationFormSteps";
import TeamManager from "@/scenes/Application/components/TeamManager/TeamManager";
import { Stack } from "@/components/ui/stack";
import getHackerForActiveHackathonFromSession from "@/server/getters/getHackerForActiveHackathonFromSession";
import UnverifiedEmailAlert from "@/components/common/UnverifiedEmailAlert";
import ReimbursementRequestManager from "@/scenes/Application/components/ReimbursementRequestManager/ReimbursementRequestManager";
import UnsignedUserAlert from "@/scenes/Application/components/UnsignedUserAlert";
import { redirect } from "next/navigation";

const Application = async () => {
  const {
    closedPortal,
    hackathonId,
    hackerId,
    applicationId,
    signedIn,
    emailVerified,
    redirectToOrganizer,
  } = await getHackerForActiveHackathonFromSession();
  if (redirectToOrganizer) {
    redirect("/dashboard");
  }
  if (!hackathonId) {
    return null;
  }
  return (
    <Stack
      direction="column"
      className="mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset w-full mb-20 md:mb-40"
    >
      {!signedIn && <UnsignedUserAlert />}
      {signedIn && !emailVerified && <UnverifiedEmailAlert />}
      <Stack direction="column" className="w-full gap-20">
        <Suspense fallback={<div>Loading...</div>}>
          <ApplicationFormSteps
            closedPortal={closedPortal}
            hackathonId={hackathonId}
            applicationId={applicationId}
          />
        </Suspense>
        <Stack className="flex-col gap-20 md:flex-row w-full md:w-[70vw] mx-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <TeamManager hackerId={hackerId} />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <ReimbursementRequestManager hackerId={hackerId} />
          </Suspense>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Application;
