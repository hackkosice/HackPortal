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
import { PlusIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import callServerAction from "@/services/helpers/server/callServerAction";
import createNewTable from "@/server/actions/dashboard/tables/createNewTable";
import editTable from "@/server/actions/dashboard/tables/editTable";

const newTableFormSchema = z.object({
  code: z.string().min(1).max(20),
});

type NewTableForm = z.infer<typeof newTableFormSchema>;

type NewTableDialogProps = {
  mode?: "create" | "edit";
  initialData?: NewTableForm;
  hackathonId: number;
  tableId?: number;
};

const NewTableDialog = ({
  mode = "create",
  initialData,
  hackathonId,
  tableId,
}: NewTableDialogProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<NewTableForm>({
    resolver: zodResolver(newTableFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const onNewTableCreation = async (data: NewTableForm) => {
    if (mode === "edit") {
      const res = await callServerAction(editTable, {
        tableId: tableId as number,
        code: data.code,
      });
      if (!res.success) {
        setSubmitError(res.message);
        return;
      }
    } else if (mode === "create") {
      const res = await callServerAction(createNewTable, {
        hackathonId,
        code: data.code,
      });
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

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button size="smallest" variant="outline" className="p-1 px-2">
            <PlusIcon className="w-4 h-4 mr-1 text-hkOrange inline" />
            Create new table
          </Button>
        ) : (
          <Button variant="ghost" size="small">
            <PencilIcon className="w-4 h-4 mr-1 inline" />
            Edit table
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create new table" : "Edit table"}
          </DialogTitle>
        </DialogHeader>
        {submitError && (
          <Text size="small" className="text-red-500">
            {submitError}
          </Text>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNewTableCreation)}>
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

export default NewTableDialog;
