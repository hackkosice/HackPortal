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

const newTeamFormSchema = z.object({
  name: z.string().min(1),
});

type NewTeamForm = z.infer<typeof newTeamFormSchema>;

const NewTeamDialog = () => {
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<NewTeamForm>({
    resolver: zodResolver(newTeamFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onNewTeamCreation = async (data: NewTeamForm) => {
    await createTeam(data);
    setIsOpened(false);
  };

  useEffect(() => {
    if (isOpened) form.reset();
  }, [form, isOpened]);

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="w-4 h-4 mr-1 text-white inline" />
          Create new team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new team</DialogTitle>
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
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTeamDialog;
