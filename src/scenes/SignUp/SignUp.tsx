"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Stack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";
import clearLocalApplicationData from "@/services/helpers/localData/clearLocalApplicationData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { z } from "zod";
import signUp from "@/server/actions/signUp";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
  localApplicationData: z
    .array(
      z.object({
        fieldId: z.number(),
        value: z.string(),
      })
    )
    .optional(),
});

export type SignUpSchema = z.infer<typeof signupSchema>;

const SignUp = () => {
  const router = useRouter();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = useCallback(
    async (data: SignUpSchema) => {
      const localApplicationData = getLocalApplicationData();
      await signUp({
        ...data,
        localApplicationData,
      });

      // TODO handle error states
      clearLocalApplicationData();
      router.push("/application");
    },
    [router]
  );

  return (
    <Card className="m-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack direction="column">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Your email"
                        autoComplete="email"
                        {...field}
                      />
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
              <Button type="submit">Sign up</Button>
            </Stack>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUp;
