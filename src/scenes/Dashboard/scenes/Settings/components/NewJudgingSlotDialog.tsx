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
import callServerAction from "@/services/helpers/server/callServerAction";
import { Text } from "@/components/ui/text";
import editJudgingSlot from "@/server/actions/dashboard/judging/editJudgingSlot";
import createJudgingSlot from "@/server/actions/dashboard/judging/createJudgingSlot";
import { PlusIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import timeStringToDate from "@/services/helpers/timeStringToDate";

const newJudgingSlotFormSchema = z.object({
  startTime: z
    .string()
    .min(1)
    .regex(/^\d{2}:\d{2}$/, { message: "Invalid time format" }),
  endTime: z
    .string()
    .min(1)
    .regex(/^\d{2}:\d{2}$/, { message: "Invalid time format" }),
});

type NewJudgingSlotForm = z.infer<typeof newJudgingSlotFormSchema>;

type NewJudgingSlotDialogProps = {
  mode: "create" | "edit";
  judgingSlotId?: number;
  hackathonId?: number;
  initialData?: NewJudgingSlotForm;
};

const NewJudgingSlotDialog = ({
  mode,
  initialData,
  judgingSlotId,
  hackathonId,
}: NewJudgingSlotDialogProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<NewJudgingSlotForm>({
    resolver: zodResolver(newJudgingSlotFormSchema),
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  const onNewJudgingSlot = async (data: NewJudgingSlotForm) => {
    const startTime = timeStringToDate(data.startTime);
    const endTime = timeStringToDate(data.endTime);

    if (startTime >= endTime) {
      setSubmitError("Ending time must be after starting time");
      return;
    }

    if (mode === "edit" && judgingSlotId) {
      const res = await callServerAction(editJudgingSlot, {
        startTime,
        endTime,
        judgingSlotId,
      });
      if (!res.success) {
        setSubmitError(res.message);
        return;
      }
    } else if (mode === "create" && hackathonId) {
      const res = await callServerAction(createJudgingSlot, {
        startTime,
        endTime,
        hackathonId,
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
      setSubmitError(null);
      form.reset(initialData);
    } else if (mode === "create" && isOpened) {
      setSubmitError(null);
      form.reset();
    }
  }, [isOpened, form, mode, initialData]);

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button variant="outline">
            <PlusIcon className="w-4 h-4 mr-1 text-hkOrange inline" />
            Create new judging slot
          </Button>
        ) : (
          <Button variant="ghost" size="small" className="p-1">
            <PencilIcon className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create new judging slot"
              : "Edit judging slot"}
          </DialogTitle>
        </DialogHeader>
        {submitError && (
          <Text size="small" className="text-red-500">
            {submitError}
          </Text>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNewJudgingSlot)}>
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting time</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="HH:MM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ending time</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="HH:MM" {...field} />
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

export default NewJudgingSlotDialog;
