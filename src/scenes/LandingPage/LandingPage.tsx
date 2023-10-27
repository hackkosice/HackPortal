import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import Link from "next/link";

const LandingPage = () => {
  return (
    <Card className="m-auto">
      <CardHeader>
        <CardTitle>
          Welcome to application portal for Hack Kosice 2023!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Text>This is the place where you can apply for Hack Kosice 2023.</Text>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href="/application">Start application</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LandingPage;
