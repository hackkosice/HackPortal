import React from "react";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Stack } from "@/components/Stack";
import Link from "next/link";

const LandingPage = () => {
  return (
    <Card>
      <Heading spaceAfter="large" centered>
        Landing Page
      </Heading>
      <Stack direction="column">
        <Text>Welcome to application portal of Hack Kosice 2023!</Text>
        <Link href="/dashboard">
          <Button label="Dashboard" />
        </Link>
      </Stack>
    </Card>
  );
};

export default LandingPage;
