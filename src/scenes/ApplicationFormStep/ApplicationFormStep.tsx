/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Stack } from "@/components/Stack";
import { Button } from "@/components/Button";
import { useRouter } from "next/router";
import FormRenderer from "@/scenes/ApplicationFormStep/components/FormRenderer";
import { trpc } from "@/services/trpc";

export type Props = {
  stepId: number;
};

const ApplicationFormStep = ({ stepId }: Props) => {
  const { push } = useRouter();
  const { data } = trpc.stepFormFields.useQuery({ stepId });
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

    push("/dashboard");
  };

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
                href="/dashboard"
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
