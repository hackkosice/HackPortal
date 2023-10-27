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
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import GithubButton from "./components/SocialButtons/GithubButton";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { BuiltInProviderType } from "next-auth/providers";
import { signinSchema, SignInSchema } from "@/server/schemas/auth";

type SigninPageProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType>,
    ClientSafeProvider
  > | null;
};

const SignIn = ({ providers }: SigninPageProps) => {
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
    <Card className="m-auto w-full md:w-fit">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Text spaceAfter="medium" type="error">
            {error === "CredentialsSignin" && "Invalid credentials"}
          </Text>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-96">
            <Stack direction="column" spaceAfter="medium">
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
                        placeholder="Password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Sign in</Button>
            </Stack>
          </form>
        </Form>
        <Stack direction="column">
          <Button variant="outline" asChild>
            <Link href="/signup">Sign up with email</Link>
          </Button>
          {providers && Object.keys(providers).includes("github") && (
            <GithubButton onClick={() => signIn("github")} />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SignIn;
