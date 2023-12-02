"use client";

import { useEffect } from "react";
import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";
import callServerAction from "@/services/helpers/server/callServerAction";
import syncLocalApplicationDataWithServer from "@/server/actions/applicationForm/syncLocalApplicationDataWithServer";
import clearLocalApplicationData from "@/services/helpers/localData/clearLocalApplicationData";

type LocalApplicationDataSyncProps = {
  applicationId: number | null;
  hackathonId: number;
};
const LocalApplicationDataSync = ({
  applicationId,
  hackathonId,
}: LocalApplicationDataSyncProps) => {
  useEffect(() => {
    if (!applicationId) {
      return;
    }
    const localApplicationData = getLocalApplicationData();
    if (localApplicationData) {
      callServerAction(syncLocalApplicationDataWithServer, {
        hackathonId,
        localApplicationData,
      }).then((res) => {
        if (res.success) {
          clearLocalApplicationData();
        }
      });
    }
  }, [applicationId, hackathonId]);
  return null;
};

export default LocalApplicationDataSync;
