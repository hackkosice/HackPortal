import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getLandingPageInfo from "@/server/getters/landingPageInfo";
import MarkDownRenderer from "@/components/common/MarkDownRenderer";

const LandingPage = async () => {
  const { title, description, ctaContent } = await getLandingPageInfo();
  return (
    <Card className="m-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <MarkDownRenderer markdown={description} />
      </CardContent>
      <CardFooter>
        {ctaContent && (
          <Button asChild>
            <Link href="/application">{ctaContent}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LandingPage;
