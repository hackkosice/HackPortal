"use client";

import React, { useEffect, useState } from "react";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import callServerAction from "@/services/helpers/server/callServerAction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import assignTeamToChallenge from "@/server/actions/dashboard/challenges/assignTeamToChallenge";
import { Challenge } from "@/server/getters/dashboard/tables/getChallengeList";

const assignChallengeFormSchema = z.object({
  challengeId: z.string().min(1).max(20),
});

type AssignChallengeForm = z.infer<typeof assignChallengeFormSchema>;

type AssignChallengeDialogProps = {
  teamId: number;
  challenges: Challenge[];
  filterChallengeIds: number[];
};

const AssignChallengeDialog = ({
  teamId,
  challenges,
  filterChallengeIds,
}: AssignChallengeDialogProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<AssignChallengeForm>({
    resolver: zodResolver(assignChallengeFormSchema),
    defaultValues: {
      challengeId: "",
    },
  });

  const onAssignTable = async ({ challengeId }: AssignChallengeForm) => {
    const res = await callServerAction(assignTeamToChallenge, {
      teamId,
      challengeId: Number(challengeId),
    });
    if (!res.success) {
      setSubmitError(res.message);
      return;
    }

    setIsOpened(false);
  };

  useEffect(() => {
    if (isOpened) {
      form.reset();
      setSubmitError(null);
    }
  }, [form, isOpened]);

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="small" className="pl-1">
          +
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign challenge</DialogTitle>
        </DialogHeader>
        {submitError && (
          <Text size="small" className="text-red-500">
            {submitError}
          </Text>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAssignTable)}>
            <FormField
              control={form.control}
              name="challengeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenge</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a challenge" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {challenges
                        .filter(
                          (challenge) =>
                            !filterChallengeIds.includes(challenge.id)
                        )
                        .map((challenge) => (
                          <SelectItem
                            key={challenge.id}
                            value={String(challenge.id)}
                          >
                            {challenge.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-5">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignChallengeDialog;
