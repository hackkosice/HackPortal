import React from "react";
import { Stack } from "@/components/Stack";
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
import { Text } from "@/components/Text";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { SigninPageProps } from "@/pages/signin";
import GithubButton from "./components/SocialButtons/GithubButton";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInSchema, signinSchema } from "@/server/services/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";

const SignInPage = ({ providers }: SigninPageProps) => {
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    query: { error },
  } = useRouter();

  const onSubmit = async (data: SignInSchema) => {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/application",
    });
  };

  return (
    <Card>
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
          {Object.keys(providers).includes("github") && (
            <GithubButton onClick={() => signIn("github")} />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SignInPage;
