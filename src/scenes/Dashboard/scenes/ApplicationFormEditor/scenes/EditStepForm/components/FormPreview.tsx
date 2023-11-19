"use client";

import React from "react";
import FormRenderer from "@/components/common/FormRenderer/FormRenderer";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FormFieldData } from "@/server/services/helpers/applicationForm/getStepDataForForm";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type FormPreviewProps = {
  formFields: FormFieldData[];
};
const FormPreview = ({ formFields }: FormPreviewProps) => {
  const { toast } = useToast();
  return (
    <ScrollArea className="max-h-[564px] w-full px-1">
      <FormRenderer
        onSubmit={(data) => {
          toast({
            title: "Form submitted!",
            description: (
              <ScrollArea className="max-w-[330px]">
                <pre>{JSON.stringify(data, null, 2)}</pre>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ),
          });
        }}
        actionButtons={
          <Button type="submit" className="px-6">
            Test submit
          </Button>
        }
        formFields={formFields}
        className="w-full"
      />
    </ScrollArea>
  );
};

export default FormPreview;
