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
import callServerAction from "@/services/helpers/server/callServerAction";
import assignTeamToTable from "@/server/actions/dashboard/tables/assignTeamToTable";

const assignTableFormSchema = z.object({
  code: z.string().min(1).max(20),
});

type AssignTableForm = z.infer<typeof assignTableFormSchema>;

type AssignTableDialogProps = {
  teamId: number;
};

const AssignTableDialog = ({ teamId }: AssignTableDialogProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<AssignTableForm>({
    resolver: zodResolver(assignTableFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const onAssignTable = async (data: AssignTableForm) => {
    const res = await callServerAction(assignTeamToTable, {
      teamId,
      tableCode: data.code,
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
          Assign table
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a table to assign the team to</DialogTitle>
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table code</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
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

export default AssignTableDialog;
