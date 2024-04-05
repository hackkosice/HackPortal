"use client";

import React, { useEffect, useState } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import setMaxTeamSize from "@/server/actions/dashboard/settings/setMaxTeamSize";
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

const maxTeamSizeSchema = z.object({
  maxTeamSize: z.number().refine((maxValue) => maxValue > 1, {
    message: "Value must be more than 1",
  }),
});

type MaxTeamSizeForm = z.infer<typeof maxTeamSizeSchema>;
type HackathonMaxTeamSizeDialogProps = {
  initialMaxTeamSize: number;
  hackathonId: number;
};
const HackathonMaxTeamSizeDialog = ({
  hackathonId,
  initialMaxTeamSize,
}: HackathonMaxTeamSizeDialogProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm<MaxTeamSizeForm>({
    resolver: zodResolver(maxTeamSizeSchema),
    defaultValues: {
      maxTeamSize: initialMaxTeamSize,
    },
  });

  const onSave = async ({ maxTeamSize }: MaxTeamSizeForm) => {
    await setMaxTeamSize({ maxTeamSize, hackathonId });
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [form, open]);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>Set max team size</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set max team size</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)}>
            <FormField
              control={form.control}
              name="maxTeamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max team size</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Max team size"
                      {...field}
                      onChange={(event) => {
                        if (event.target.value === "") {
                          field.onChange("");
                        }
                        const parsedValue = parseInt(event.target.value);
                        if (isNaN(parsedValue)) {
                          return;
                        }
                        field.onChange(parseInt(event.target.value));
                      }}
                    />
                  </FormControl>
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

export default HackathonMaxTeamSizeDialog;
