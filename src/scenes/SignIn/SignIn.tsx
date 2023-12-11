"use client";

import React from "react";
import { Stack } from "@/components/ui/stack";
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
import { Text } from "@/components/ui/text";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import GithubButton from "./components/SocialButtons/GithubButton";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SignInSchema } from "@/server/schemas/auth";
import GoogleButton from "@/scenes/SignIn/components/SocialButtons/GoogleButton";

const SignIn = () => {
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  const onSubmit = async (data: SignInSchema) => {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/application",
    });
  };

  return (
    <Card className="m-auto w-full md:w-fit md:px-10 md:py-5">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Text spaceAfter="medium" type="error">
            {error === "CredentialsSignin" && "Invalid credentials"}
            {error === "OAuthAccountNotLinked" && "Wrong sign in method"}
          </Text>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full md:w-96"
          >
            <Stack direction="column" spaceAfter="medium">
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
                        placeholder="Password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Link href="/forgot-password" className="text-hkOrange underline">
                Forgot your password?
              </Link>
              <Button type="submit">Sign in</Button>
            </Stack>
          </form>
        </Form>
        <Stack direction="column" className="gap-3">
          <GithubButton
            onClick={() => signIn("github")}
            content="Sign in with Github"
          />
          <GoogleButton
            onClick={() => signIn("google")}
            content="Sign in with Google"
          />
          <Text className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-hkOrange">
              Sign up here
            </Link>
          </Text>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SignIn;
