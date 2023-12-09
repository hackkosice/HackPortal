"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import createTravelReimbursementRequest from "@/server/actions/travelReimbursement/createTravelReimbursementRequest";
import Tooltip from "@/components/common/Tooltip";

type RequestReimbursementButtonProps = {
  isSignedIn?: boolean;
  hasEmailVerified?: boolean;
};

const requestReimbursementSchema = z.object({
  countryOfTravel: z.string().min(1),
});

type RequestReimbursementForm = z.infer<typeof requestReimbursementSchema>;

const RequestReimbursementButton = ({
  isSignedIn,
  hasEmailVerified,
}: RequestReimbursementButtonProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<RequestReimbursementForm>({
    resolver: zodResolver(requestReimbursementSchema),
    defaultValues: {
      countryOfTravel: "",
    },
  });

  const onRequestTravelReimbursement = async (
    data: RequestReimbursementForm
  ) => {
    await createTravelReimbursementRequest({
      country: data.countryOfTravel,
    });
    setIsOpened(false);
  };

  useEffect(() => {
    if (isOpened) form.reset();
  }, [form, isOpened]);

  const requestButton = (
    <Button variant="outline" disabled={!isSignedIn || !hasEmailVerified}>
      Request travel reimbursement
    </Button>
  );
  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        {!isSignedIn || !hasEmailVerified ? (
          <Tooltip
            trigger={<span>{requestButton}</span>}
            content={
              !isSignedIn
                ? "You must be signed in to request travel reimbursement"
                : "You must verify your email to request travel reimbursement"
            }
          />
        ) : (
          requestButton
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Travel reimbursement request</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onRequestTravelReimbursement)}>
            <FormField
              control={form.control}
              name="countryOfTravel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Country where you will be travelling from
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-5">
              <Button type="submit">Request</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestReimbursementButton;
