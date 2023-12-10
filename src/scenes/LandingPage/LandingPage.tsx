import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import getLandingPageInfo from "@/server/getters/landingPageInfo";
import MarkDownRenderer from "@/components/common/MarkDownRenderer";
import LandingPageActionButton from "@/scenes/LandingPage/components/LandingPageActionButton";

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
        {ctaContent && <LandingPageActionButton content={ctaContent} />}
      </CardFooter>
    </Card>
  );
};

export default LandingPage;
