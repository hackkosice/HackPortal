"use client";

import React, { useEffect, useState } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import callServerAction from "@/services/helpers/server/callServerAction";
import { Stack } from "@/components/ui/stack";
import createChallenge from "@/server/actions/dashboard/challenges/createChallenge";
import { Textarea } from "@/components/ui/textarea";

const newChallengeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

type NewChallengeForm = z.infer<typeof newChallengeSchema>;
type AddNewChallengeDialogProps = {
  sponsorId: number;
};
const CreateSponsorChallengeDialog = ({
  sponsorId,
}: AddNewChallengeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<NewChallengeForm>({
    resolver: zodResolver(newChallengeSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSave = async ({ title, description }: NewChallengeForm) => {
    const res = await callServerAction(createChallenge, {
      title,
      description,
      sponsorId,
    });
    if (res.success) {
      setOpen(false);
    } else {
      setError(res.message);
    }
  };

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [form, open]);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="small" variant="outline">
          Create new challenge
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New challenge</DialogTitle>
        </DialogHeader>
        {error && <div className="text-red-500">{error}</div>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)}>
            <Stack direction="column">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Stack>
            <DialogFooter className="mt-5">
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSponsorChallengeDialog;
