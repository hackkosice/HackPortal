"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Stack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
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
import callServerAction from "@/services/helpers/server/callServerAction";
import { signIn } from "next-auth/react";
import GithubButton from "@/scenes/SignIn/components/SocialButtons/GithubButton";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  repeatPassword: z.string().min(6),
});

export type SignUpSchema = z.infer<typeof signupSchema>;

const SignUp = () => {
  const router = useRouter();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signupSchema),
  });
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = useCallback(
    async (data: SignUpSchema) => {
      if (data.password !== data.repeatPassword) {
        setError("Passwords do not match");
        return;
      }
      const result = await callServerAction(signUp, {
        email: data.email,
        password: data.password,
      });
      if (!result.success) {
        setError(result.message);
        return;
      }

      await signIn("credentials", {
        email: data.email,
        password: data.password,
      });

      router.push("/application");
    },
    [router]
  );

  return (
    <Card className="m-auto w-full md:w-[60vw]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent className="md:w-[80%] mx-auto">
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack direction="column">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Email</FormLabel>
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
                    <FormLabel required>Password</FormLabel>
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
                name="repeatPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Repeat password</FormLabel>
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
              <Button type="submit">Sign up with email and password</Button>
              <GithubButton
                onClick={() => signIn("github")}
                content="Sign up with Github"
              />
            </Stack>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUp;
