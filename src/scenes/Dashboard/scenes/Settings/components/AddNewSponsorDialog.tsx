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
import createNewSponsor from "@/server/actions/dashboard/settings/createNewSponsor";
import { Stack } from "@/components/ui/stack";

const newSponsorSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be less than 100 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
  company: z.string().min(1),
});

type NewSponsorForm = z.infer<typeof newSponsorSchema>;
type AddNewSponsorDialogProps = {
  hackathonId: number;
};
const AddNewSponsorDialog = ({ hackathonId }: AddNewSponsorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<NewSponsorForm>({
    resolver: zodResolver(newSponsorSchema),
    defaultValues: {
      email: "",
      password: "",
      company: "",
    },
  });

  const onSave = async ({ email, password, company }: NewSponsorForm) => {
    const res = await callServerAction(createNewSponsor, {
      email,
      password,
      company,
      hackathonId,
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
        <Button>Create new sponsor account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New sponsor account</DialogTitle>
        </DialogHeader>
        {error && <div className="text-red-500">{error}</div>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)}>
            <Stack direction="column">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
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

export default AddNewSponsorDialog;
