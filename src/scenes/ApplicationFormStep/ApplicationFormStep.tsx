"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Stack } from "@/components/Stack";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import FormRenderer from "@/scenes/ApplicationFormStep/components/FormRenderer";
import { trpc } from "@/services/trpc";
import { ApplicationFormStepData } from "@/server/endpoints/applicationFormStep";

export type Props = {
  data: ApplicationFormStepData;
};

const ApplicationFormStep = ({ data }: Props) => {
  const { push, refresh } = useRouter();
  const { mutateAsync: saveFields } = trpc.saveFieldValues.useMutation();

  const onFormSubmit = async (data: any) => {
    const payload = Object.keys(data)
      .map((key) => {
        return {
          fieldId: Number(key),
          value: data[key].toString(),
        };
      })
      .filter((fieldValue) => fieldValue.value);
    await saveFields(payload);

    push("/application");
  };

  // Refresh page to get updated data - implement server action to refresh data instead
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Card>
      <Heading>{data?.data.title}</Heading>
      {data && (
        <FormRenderer
          formFields={data.data.formFields}
          onSubmit={onFormSubmit}
          actionButtons={
            <Stack direction="row">
              <Button
                label="Back"
                type="buttonLink"
                href="/application"
                colorType="secondary"
              />
              <Button label="Save" type="submit" />
            </Stack>
          }
        />
      )}
    </Card>
  );
};

export default ApplicationFormStep;
