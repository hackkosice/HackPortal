"use client";

import React from "react";
import { GetAdminInfoData } from "@/server/getters/dashboard/settings/adminInfo";
import { Stack } from "@/components/ui/stack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import changeAdminStatus from "@/server/actions/dashboard/settings/changeAdminStatus";

type AdminManagerProps = {
  adminInfo: GetAdminInfoData;
  hackathonId: number;
};
const AdminManager = ({ adminInfo, hackathonId }: AdminManagerProps) => {
  return (
    <Stack direction="column">
      <Heading size="small">Manage admins</Heading>
      <Stack direction="column">
        <Text weight="bold">Current admins</Text>
        <Stack direction="column">
          {adminInfo.admins.map((admin) => (
            <Stack direction="row" key={admin.email} alignItems="center">
              <Text>{admin.email}</Text>

              {admin.isCurrentUser ? (
                "(You)"
              ) : (
                <Button
                  className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-600"
                  size="small"
                  onClick={async () => {
                    await changeAdminStatus({
                      hackathonId,
                      organizerId: admin.id,
                      newIsAdmin: false,
                    });
                  }}
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Make non-admin
                </Button>
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Stack direction="column">
        <Text weight="bold">Current non-admins</Text>
        <Stack direction="column">
          {adminInfo.nonAdmins.map((nonAdmin) => (
            <Stack direction="row" key={nonAdmin.email} alignItems="center">
              <Text>{nonAdmin.email}</Text>
              {nonAdmin.isCurrentUser ? (
                "(You)"
              ) : (
                <Button
                  className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-600"
                  size="small"
                  onClick={async () => {
                    await changeAdminStatus({
                      hackathonId,
                      organizerId: nonAdmin.id,
                      newIsAdmin: true,
                    });
                  }}
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Make admin
                </Button>
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AdminManager;
