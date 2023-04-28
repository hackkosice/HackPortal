import React from "react";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";

const Dashboard = () => {
  return (
    <Card>
      <Heading spaceAfter="large" centered>
        Dashboard
      </Heading>
      <Text>Welcome name!</Text>
    </Card>
  );
};

export default Dashboard;
