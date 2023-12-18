"use client";

import React from "react";
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
import GoogleButton from "@/scenes/SignIn/components/SocialButtons/GoogleButton";
import Link from "next/link";
import { Text } from "@/components/ui/text";

export const signupSchema = z.object({
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
  repeatPassword: z.string(),
});

export type SignUpSchema = z.infer<typeof signupSchema>;

const SignUp = () => {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
  });
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: SignUpSchema) => {
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
      callbackUrl: "/application",
    });
  };

  return (
    <Card className="m-auto w-full md:w-[60vw]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent className="md:w-[80%] mx-auto">
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <Stack direction="column" className="gap-3 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
              </Stack>
            </form>
          </Form>
          <GithubButton
            onClick={() =>
              signIn("github", {
                callbackUrl: "/application",
              })
            }
            content="Sign up with Github"
          />
          <GoogleButton
            onClick={() =>
              signIn("google", {
                callbackUrl: "/application",
              })
            }
            content="Sign up with Google"
          />
          <Text className="text-center">
            Already have an account?{" "}
            <Link href="/signin" className="text-hkOrange">
              Sign in here
            </Link>
          </Text>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SignUp;
