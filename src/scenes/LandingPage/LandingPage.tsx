import React from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/Text";
import { Stack } from "@/components/Stack";

const LandingPage = () => {
  return (
    <Card>
      <Stack direction="column">
        <Text>Welcome to application portal for Hack Kosice 2023!</Text>
        <Button buttonType="buttonLink" href="/application">
          Start application
        </Button>
      </Stack>
    </Card>
  );
};

export default LandingPage;
