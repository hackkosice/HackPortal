import React from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Stack } from "@/components/Stack";

const LandingPage = () => {
  return (
    <Card>
      <Stack direction="column">
        <Text>Welcome to application portal for Hack Kosice 2023!</Text>
        <Button
          label="Start application"
          type="buttonLink"
          href="/application"
        />
      </Stack>
    </Card>
  );
};

export default LandingPage;
