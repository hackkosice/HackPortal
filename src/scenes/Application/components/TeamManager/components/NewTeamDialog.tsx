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
import createTeam from "@/server/actions/team/createTeam";
import { PlusIcon } from "@heroicons/react/24/outline";
import editTeamName from "@/server/actions/team/editTeamName";
import { PencilIcon } from "@heroicons/react/24/solid";
import Tooltip from "@/components/common/Tooltip";
import callServerAction from "@/services/helpers/server/callServerAction";
import useLog, { LogAction } from "@/services/hooks/useLog";

const newTeamFormSchema = z.object({
  name: z.string().min(1).max(20),
});

type NewTeamForm = z.infer<typeof newTeamFormSchema>;

type NewTeamDialogProps = {
  mode?: "create" | "edit";
  initialData?: NewTeamForm;
  isSignedIn?: boolean;
  hasEmailVerified?: boolean;
};

const NewTeamDialog = ({
  mode = "create",
  initialData,
  isSignedIn,
  hasEmailVerified,
}: NewTeamDialogProps) => {
  const { log } = useLog();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<NewTeamForm>({
    resolver: zodResolver(newTeamFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onNewTeamCreation = async (data: NewTeamForm) => {
    if (mode === "edit") {
      const res = await callServerAction(editTeamName, { newName: data.name });
      if (!res.success) {
        setSubmitError(res.message);
        return;
      }
    } else if (mode === "create") {
      const res = await callServerAction(createTeam, data);
      if (!res.success) {
        setSubmitError(res.message);
        return;
      }
    }

    setIsOpened(false);
  };

  useEffect(() => {
    if (mode === "edit" && initialData && isOpened) {
      form.reset(initialData);
    } else if (mode === "create" && isOpened) {
      form.reset();
    }
  }, [form, initialData, isOpened, mode]);

  const triggerButton =
    mode === "create" ? (
      <Button
        disabled={!isSignedIn || !hasEmailVerified}
        onClick={() => {
          log({
            action: LogAction.ButtonClicked,
            detail: "Create team",
          });
        }}
      >
        <PlusIcon className="w-4 h-4 mr-1 text-white inline" />
        Create new team
      </Button>
    ) : (
      <Button
        variant="ghost"
        size="small"
        disabled={!isSignedIn || !hasEmailVerified}
        onClick={() => {
          log({
            action: LogAction.ButtonClicked,
            detail: "Edit team name",
          });
        }}
      >
        <PencilIcon className="w-4 h-4 mr-1 inline" />
        Edit team name
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
                ? "You must be signed in to create a team"
                : "You must verify your email to create a team"
            }
          />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create new team" : "Edit team name"}
          </DialogTitle>
        </DialogHeader>
        {submitError && (
          <Text size="small" className="text-red-500">
            {submitError}
          </Text>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNewTeamCreation)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Best team ever!!!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-5">
              <Button type="submit">
                {mode === "create" ? "Create" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTeamDialog;
