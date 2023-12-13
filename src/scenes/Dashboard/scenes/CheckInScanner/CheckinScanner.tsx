"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import callServerAction from "@/services/helpers/server/callServerAction";
import verifyCheckinCode, {
  VerifyCheckinCodeOutput,
} from "@/server/actions/dashboard/checkIn/verifyCheckinCode";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { CameraIcon } from "@heroicons/react/24/outline";
import checkinHacker from "@/server/actions/dashboard/checkIn/checkinHacker";
import { useToast } from "@/components/ui/use-toast";
import ManualEmailCheckin from "@/scenes/Dashboard/scenes/CheckInScanner/components/ManualEmailCheckin";

type CheckinScannerProps = {
  hackathonId: number;
};
const CheckinScanner = ({ hackathonId }: CheckinScannerProps) => {
  const { toast } = useToast();
  const [hackerInfo, setHackerInfo] =
    React.useState<VerifyCheckinCodeOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [scanning, setScanning] = React.useState(false);
  const verifyScannedCode = async (code: string) => {
    const res = await callServerAction(verifyCheckinCode, {
      checkinCode: code,
      hackathonId,
      email: null,
    });
    if (res.success) {
      setHackerInfo(res.data);
      setError(null);
    } else {
      setHackerInfo(null);
      setError(res.message);
    }
  };

  const onCheckinClick = async (hackerId: number) => {
    const res = await callServerAction(checkinHacker, {
      hackerId,
      hackathonId,
    });
    if (res.success) {
      toast({
        title: "Hacker checked in",
        description: "Hacker has been checked in",
      });
      setHackerInfo(null);
    } else {
      toast({
        title: "Error checking in hacker",
        description: res.message,
        variant: "destructive",
      });
    }
  };
  return (
    <Card className="md:w-[70vw] mx-auto">
      <CardHeader>
        <Heading size="small">Check-in scanner</Heading>
      </CardHeader>
      <CardContent>
        <Stack direction="column">
          <Button onClick={() => setScanning(true)}>
            <CameraIcon className="w-4 h-4 text-white mr-2" />
            Scan code
          </Button>
          <ManualEmailCheckin
            setHackerInfo={setHackerInfo}
            hackathonId={hackathonId}
          />
          {scanning && (
            <QrScanner
              onDecode={async (result) => {
                await verifyScannedCode(result);
                setScanning(false);
              }}
              onError={(error) => console.log(error?.message)}
              constraints={{
                facingMode: "environment",
                aspectRatio: 1,
              }}
            />
          )}
          <Stack direction="column" spacing="small">
            {hackerInfo && !error && !scanning && (
              <>
                <Heading size="small" className="text-green-600">
                  Success!
                </Heading>
                {hackerInfo.applicationValues.map((value) => (
                  <Text key={value.fieldId}>
                    <b>{value.label}</b>: {value.value}
                  </Text>
                ))}
                <Text>
                  <b>Team:</b> {hackerInfo.teamName ?? "none"}
                </Text>
                <Button onClick={() => onCheckinClick(hackerInfo?.hackerId)}>
                  Check-in hacker
                </Button>
              </>
            )}
            {error && !scanning && (
              <>
                <Heading size="small" className="text-red-500">
                  Error!
                </Heading>
                <Text>{error}</Text>
              </>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CheckinScanner;
