import React from "react";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UnsignedUserAlert = () => {
  return (
    <Card className="p-5 w-[95vw] md:w-[50vw] md:mx-auto mb-5 bg-red-600">
      <Stack justify="center" alignItems="center" direction="column">
        <Text className="font-title font-semibold text-xl md:text-2xl text-white">
          You are not signed in
        </Text>
        <Text className="text-white text-sm md:text-base">
          The application is currently saved only in your browser. If you want
          to save your progress, please create an account or sign into an
          existing account. You can&apos;t submit your application or create
          teams without signing in.
        </Text>
        <Button asChild>
          <Link href="/signup">Create an account</Link>
        </Button>
      </Stack>
    </Card>
  );
};

export default UnsignedUserAlert;
