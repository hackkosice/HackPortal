"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

const reimbursementAmountSchema = z.object({
  amount: z
    .number()
    .refine((maxValue) => maxValue !== 0, { message: "Value cannot be 0" }),
});

type ReimbursementAmountForm = z.infer<typeof reimbursementAmountSchema>;

type ReimbursementAmountDialogProps = {
  isOpened: boolean;
  onClose: (amount: number) => void;
  onOpenChange: (isOpened: boolean) => void;
  country: string;
};

const ReimbursementAmountDialog = ({
  isOpened,
  onOpenChange,
  onClose,
  country,
}: ReimbursementAmountDialogProps) => {
  const form = useForm<ReimbursementAmountForm>({
    resolver: zodResolver(reimbursementAmountSchema),
  });

  const onAmountSave = async ({ amount }: ReimbursementAmountForm) => {
    onClose(amount);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set reimbursement amount</DialogTitle>
        </DialogHeader>
        The country is: {country}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAmountSave)}>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount to reimburse</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Amount in EUR"
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

export default ReimbursementAmountDialog;
