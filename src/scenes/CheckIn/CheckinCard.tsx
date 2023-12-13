import React from "react";
import getCheckinCode from "@/server/getters/application/checkinCode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";

const CheckinCard = async () => {
  const { checkinCode, email } = await getCheckinCode();
  if (!checkinCode) {
    redirect("/application");
  }
  return (
    <Stack
      direction="column"
      className="mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset w-full md:w-[50vw] md:min-w-[700px] mx-auto mb-20"
    >
      <Link href="/application" className="text-hkOrange">
        <Stack direction="row" alignItems="center" spacing="small">
          <ChevronLeftIcon className="h-5 w-5" />
          Back to application
        </Stack>
      </Link>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Check-in</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack direction="column" alignItems="center" className="w-full">
            <QRCodeSVG value={checkinCode} size={256} />
            <Text>{email}</Text>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CheckinCard;
