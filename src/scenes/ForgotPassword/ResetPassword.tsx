"use client";

import React from "react";
import { Stack } from "@/components/ui/stack";
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
import { Button } from "@/components/ui/button";
import callServerAction from "@/services/helpers/server/callServerAction";
import resetPassword from "@/server/actions/auth/resetPassword";

type ResetPasswordProps = {
  userId: number;
  token: string;
};

const resetPasswordFormSchema = z.object({
  newPassword: z
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
  repeatNewPassword: z.string().min(1),
});

type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;
const ResetPassword = ({ userId, token }: ResetPasswordProps) => {
  const [error, setError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordFormSchema),
  });
  const onSubmit = async (data: ResetPasswordForm) => {
    if (data.newPassword !== data.repeatNewPassword) {
      setError("Passwords do not match");
      return;
    }
    const res = await callServerAction(resetPassword, {
      newPassword: data.newPassword,
      userId,
      token,
    });

    if (!res.success) {
      setError(res.message);
      return;
    }

    setError(null);
    setIsSuccess(true);
  };
  return (
    <>
      {error && <div className="text-red-500">{error}</div>}
      {isSuccess && (
        <div className="text-green-500">
          Password reset successful! You can now sign in with your new password.
        </div>
      )}
      {!isSuccess && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <Stack direction="column">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>New password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repeatNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Repeat new password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Reset password</Button>
            </Stack>
          </form>
        </Form>
      )}
    </>
  );
};

export default ResetPassword;
