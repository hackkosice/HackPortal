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
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import formatBytesToString from "@/services/helpers/formatBytesToString";
import { Loader2 } from "lucide-react";
import uploadTravelReimbursementDetails from "@/server/actions/travelReimbursement/uploadTravelReimbursementDetails";

const MAX_FILE_SIZE_IN_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_IN_MB * 1024 * 1024; // 10 MB
const reimbursementDetailsSchema = z.object({
  travelDocument: z
    .custom<File>((v) => v instanceof File, {
      message: "File is required",
    })
    .refine((v) => v.size < MAX_FILE_SIZE, {
      message: `File is too big - max ${MAX_FILE_SIZE_IN_MB} MB`,
    })
    .refine((v) => v.type === "application/pdf", {
      message: "Only PDF files are allowed",
    }),
  financialDetails: z.string().min(1),
});

type ReimbursementDetailsForm = z.infer<typeof reimbursementDetailsSchema>;

type UploadDetailsForReimbursementButtonProps = {
  fileUploadUrl: string;
};
const UploadDetailsForReimbursementButton = ({
  fileUploadUrl,
}: UploadDetailsForReimbursementButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<ReimbursementDetailsForm>({
    resolver: zodResolver(reimbursementDetailsSchema),
    defaultValues: {
      financialDetails: "",
    },
  });

  const onRequestTravelReimbursement = async (
    data: ReimbursementDetailsForm
  ) => {
    setIsUploading(true);
    await fetch(fileUploadUrl, {
      method: "PUT",
      body: data.travelDocument,
    });
    await uploadTravelReimbursementDetails({
      financialDetails: data.financialDetails,
      fileName: data.travelDocument.name,
    });
    setIsUploading(false);
    setIsOpened(false);
  };

  useEffect(() => {
    if (isOpened) form.reset();
  }, [form, isOpened]);
  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        <Button>Upload details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onRequestTravelReimbursement)}>
            <Stack direction="column">
              <FormField
                control={form.control}
                name="financialDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      Financial details (bank account number, IBAN, etc.)
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="travelDocument"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <Stack direction="row" spacing="small" alignItems="center">
                      <FormLabel required>Travel document</FormLabel>
                    </Stack>
                    <FormControl>
                      <Input
                        {...field}
                        type="file"
                        className="cursor-pointer py-2 h-auto"
                        onChange={(event) =>
                          onChange(event.currentTarget.files?.[0] ?? null)
                        }
                      />
                    </FormControl>
                    {value && (
                      <Text className="text-xs">
                        Uploaded file: {(value as File).name} (
                        {formatBytesToString((value as File).size)})
                      </Text>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Stack>
            <DialogFooter className="mt-5">
              {isUploading ? (
                <Button disabled={true} className="px-6">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </Button>
              ) : (
                <Button type="submit" className="px-6">
                  Upload and save
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDetailsForReimbursementButton;
