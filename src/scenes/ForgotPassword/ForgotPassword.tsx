"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as z from "zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import callServerAction from "@/services/helpers/server/callServerAction";
import requestPasswordReset from "@/server/actions/auth/requestPasswordReset";

const forgotPasswordFormSchema = z.object({
  email: z.string().min(1),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordFormSchema>;

const ForgotPassword = () => {
  const [submitMessage, setSubmitMessage] = React.useState("");
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (data: ForgotPasswordForm) => {
    const res = await callServerAction(requestPasswordReset, data);
    if (!res.success) {
      setSubmitMessage(res.message);
      return;
    }
    setSubmitMessage(
      "If the email exists, you will receive a reset link. (Note: you can only request a reset once per 5 minutes)"
    );
  };
  return (
    <Card className="m-auto w-full md:w-[50vw] md:px-10 md:py-5">
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
      </CardHeader>
      <CardContent>
        {submitMessage && <Text spaceAfter="medium">{submitMessage}</Text>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Input your email below to receive a password request link
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-5">
              Request
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
