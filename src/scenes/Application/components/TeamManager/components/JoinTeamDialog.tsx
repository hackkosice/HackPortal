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
import joinTeam from "@/server/actions/team/joinTeam";

const joinTeamFormSchema = z.object({
  code: z.string().min(1),
});

type JoinTeamForm = z.infer<typeof joinTeamFormSchema>;

const JoinTeamDialog = () => {
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<JoinTeamForm>({
    resolver: zodResolver(joinTeamFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const onEditTitleModalSave = async (data: JoinTeamForm) => {
    await joinTeam(data);
    setIsOpened(false);
  };

  useEffect(() => {
    if (isOpened) form.reset();
  }, [form, isOpened]);

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        <Button variant="outline">Join existing team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join existing team</DialogTitle>
        </DialogHeader>
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
