"use client";

import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { PropertyValue } from "@/server/services/helpers/applications/getApplicationPropertiesForDisplay";

type HiddenPropertiesCollapsibleProps = {
  hiddenPropertiesValues: PropertyValue[];
};
const HiddenPropertiesCollapsible = ({
  hiddenPropertiesValues,
}: HiddenPropertiesCollapsibleProps) => {
  const [isHiddenPropertiesOpen, setIsHiddenPropertiesOpen] =
    React.useState(false);
  return (
    <Collapsible
      open={isHiddenPropertiesOpen}
      onOpenChange={setIsHiddenPropertiesOpen}
      className="mt-5"
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="small" className="p-0 text-black">
          <Heading size="small">Additional values</Heading>
          <ChevronsUpDown className="h-6 w-6 ml-3 text-primaryTitle" />
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        {hiddenPropertiesValues.map(({ label, value }) => (
          <Text key={label}>
            <span className="font-bold">{label}</span>: {value}
          </Text>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default HiddenPropertiesCollapsible;
