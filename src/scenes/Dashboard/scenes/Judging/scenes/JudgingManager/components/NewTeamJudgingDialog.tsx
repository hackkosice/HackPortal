"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import callServerAction from "@/services/helpers/server/callServerAction";
import createTeamJudging from "@/server/actions/dashboard/judging/createTeamJudging";
import { Text } from "@/components/ui/text";
import { Stack } from "@/components/ui/stack";
import { Combobox } from "@/components/ui/combobox";

const newTeamJudgingFormSchema = z.object({
  teamId: z.string().min(1),
});

type NewTeamJudgingForm = z.infer<typeof newTeamJudgingFormSchema>;

type NewTeamJudgingDialogProps = {
  judgingSlotId: number;
  organizerId: number;
  teamOptions: { label: string; value: string }[];
};
const NewTeamJudgingDialog = ({
  judgingSlotId,
  organizerId,
  teamOptions,
}: NewTeamJudgingDialogProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<NewTeamJudgingForm>({
    resolver: zodResolver(newTeamJudgingFormSchema),
    defaultValues: {
      teamId: "",
    },
  });

  const onNewTeamJudging = async ({ teamId }: NewTeamJudgingForm) => {
    const res = await callServerAction(createTeamJudging, {
      teamId: Number(teamId),
      judgingSlotId,
      organizerId,
    });
    if (!res.success) {
      setSubmitError(res.message);
      return;
    }

    setIsOpened(false);
  };

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        <Button size="small" variant="ghost">
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign judging</DialogTitle>
        </DialogHeader>
        {submitError && (
          <Text size="small" className="text-red-500">
            {submitError}
          </Text>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNewTeamJudging)}>
            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Stack direction="row" spacing="small" alignItems="center">
                    <FormLabel>Team</FormLabel>
                  </Stack>
                  <Combobox
                    options={teamOptions ?? []}
                    selectedOption={field.value as string}
                    onSelectOption={(value) => {
                      form.setValue("teamId", value);
                    }}
                    withoutPortal
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-5">
              <Button type="submit">Assign</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTeamJudgingDialog;
