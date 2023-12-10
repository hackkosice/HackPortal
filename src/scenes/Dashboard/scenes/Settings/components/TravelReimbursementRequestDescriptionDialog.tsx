"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import callServerAction from "@/services/helpers/server/callServerAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import setTravelReimbursementRequestDescription from "@/server/actions/travelReimbursement/setTravelReimbursementRequestDescription";
import { Textarea } from "@/components/ui/textarea";

const descriptionFormSchema = z.object({
  description: z.string(),
});

type DescriptionForm = z.infer<typeof descriptionFormSchema>;

type TravelReimbursementRequestDescriptionDialogProps = {
  initialDescription: string | null;
  hackathonId: number;
};
const TravelReimbursementRequestDescriptionDialog = ({
  initialDescription,
  hackathonId,
}: TravelReimbursementRequestDescriptionDialogProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<DescriptionForm>({
    resolver: zodResolver(descriptionFormSchema),
    defaultValues: {
      description: initialDescription ?? "",
    },
  });

  const onEditTitleModalSave = async (data: DescriptionForm) => {
    const res = await callServerAction(
      setTravelReimbursementRequestDescription,
      {
        description: data.description,
        hackathonId,
      }
    );
    if (!res.success) {
      setSubmitError(res.message);
      return;
    }
    setIsOpened(false);
  };

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        <Button>Set travel reimbursement description</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set travel reimbursement description</DialogTitle>
        </DialogHeader>
        {submitError && (
          <Text className="text-red-500" size="small">
            {submitError}
          </Text>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEditTitleModalSave)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={20} {...field} />
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

export default TravelReimbursementRequestDescriptionDialog;
