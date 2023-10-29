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
import createTeam from "@/server/actions/team/createTeam";
import { PlusIcon } from "@heroicons/react/24/outline";
import editTeamName from "@/server/actions/team/editTeamName";
import { PencilIcon } from "@heroicons/react/24/solid";

const newTeamFormSchema = z.object({
  name: z.string().min(1),
});

type NewTeamForm = z.infer<typeof newTeamFormSchema>;

type NewTeamDialogProps = {
  mode?: "create" | "edit";
  initialData?: NewTeamForm;
};

const NewTeamDialog = ({
  mode = "create",
  initialData,
}: NewTeamDialogProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<NewTeamForm>({
    resolver: zodResolver(newTeamFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onNewTeamCreation = async (data: NewTeamForm) => {
    if (mode === "edit") {
      await editTeamName({ newName: data.name });
    } else if (mode === "create") {
      await createTeam(data);
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

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>
            <PlusIcon className="w-4 h-4 mr-1 text-white inline" />
            Create new team
          </Button>
        ) : (
          <Button variant="ghost" size="small">
            <PencilIcon className="w-4 h-4 mr-1 inline" />
            Edit team name
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create new team" : "Edit team name"}
          </DialogTitle>
        </DialogHeader>
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