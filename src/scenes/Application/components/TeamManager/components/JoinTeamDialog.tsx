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
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import joinTeam from "@/server/actions/team/joinTeam";
import Tooltip from "@/components/common/Tooltip";
import callServerAction from "@/services/helpers/server/callServerAction";

const joinTeamFormSchema = z.object({
  code: z.string().min(1),
});

type JoinTeamForm = z.infer<typeof joinTeamFormSchema>;

type JoinTeamDialogProps = {
  isSignedIn?: boolean;
  hasEmailVerified?: boolean;
};

const JoinTeamDialog = ({
  isSignedIn,
  hasEmailVerified,
}: JoinTeamDialogProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<JoinTeamForm>({
    resolver: zodResolver(joinTeamFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const onEditTitleModalSave = async (data: JoinTeamForm) => {
    const res = await callServerAction(joinTeam, data);
    if (!res.success) {
      setSubmitError(res.message);
      return;
    }
    setIsOpened(false);
  };

  useEffect(() => {
    if (isOpened) form.reset();
  }, [form, isOpened]);

  const triggerButton = (
    <Button variant="outline" disabled={!isSignedIn || !hasEmailVerified}>
      Join existing team
    </Button>
  );

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        {isSignedIn && hasEmailVerified ? (
          triggerButton
        ) : (
          <Tooltip
            trigger={<span>{triggerButton}</span>}
            content={
              !isSignedIn
                ? "You must be signed in to join a team"
                : "You must verify your email to join a team"
            }
          />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join existing team</DialogTitle>
        </DialogHeader>
        {submitError && (
          <Text className="text-red-500" size="small">
            {submitError}
          </Text>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEditTitleModalSave)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team code</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-5">
              <Button type="submit">Join</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinTeamDialog;
