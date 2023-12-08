import React, { Suspense } from "react";
import ApplicationFormSteps from "@/scenes/Application/components/ApplicationForm/ApplicationFormSteps";
import TeamManager from "@/scenes/Application/components/TeamManager/TeamManager";
import { Stack } from "@/components/ui/stack";
import getHackerForActiveHackathonFromSession from "@/server/getters/getHackerForActiveHackathonFromSession";
import UnverifiedEmailAlert from "@/components/common/UnverifiedEmailAlert";
import ReimbursementRequestManager from "@/scenes/Application/components/ReimbursementRequestManager/ReimbursementRequestManager";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";

const Application = async () => {
  const { hackathonId, hackerId, applicationId, signedIn, emailVerified } =
    await getHackerForActiveHackathonFromSession();
  if (!hackathonId) {
    return null;
  }
  return (
    <Stack
      direction="column"
      className="mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset w-full mb-20 md:mb-40"
    >
      {!signedIn && (
        <Card className="p-5 w-[95vw] md:w-[50vw] md:mx-auto mb-5 bg-red-600">
          <Stack justify="center" alignItems="center" direction="column">
            <Text className="font-title font-semibold text-xl md:text-2xl text-white">
              You are not signed in
            </Text>
            <Text className="text-white text-sm md:text-base">
              The application is currently saved only in your browser. If you
              want to save your progress, please create an account or sign into
              an existing account. You can&apos;t submit your application or
              create teams without signing in.
            </Text>
          </Stack>
        </Card>
      )}
      {signedIn && !emailVerified && <UnverifiedEmailAlert />}
      <Stack direction="column" className="w-full gap-20">
        <Suspense fallback={<div>Loading...</div>}>
          <ApplicationFormSteps
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
