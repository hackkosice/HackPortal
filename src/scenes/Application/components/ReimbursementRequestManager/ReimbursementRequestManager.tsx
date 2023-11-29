import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { GlobeEuropeAfricaIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

const ReimbursementRequestManager = () => {
  return (
    <Card className="w-full p-5 relative pt-10">
      <GlobeEuropeAfricaIcon className="text-primaryTitle h-[100px] absolute opacity-20 top-[-50px] left-1/2 -translate-x-1/2" />
      <div className="z-10">
        <Heading size="medium" className="text-center">
          Your travel reimbursement
        </Heading>

        <Stack direction="column" alignItems="center" className="mt-5 gap-8">
          <Text>
            Travelling from abroad to our hackathon? We are so excited about
            that and we want to help you get here!
          </Text>
          <Stack direction="row" justify="around" className="">
            <Button>Request reimbursement</Button>
          </Stack>
        </Stack>
      </div>
    </Card>
  );
};

export default ReimbursementRequestManager;
