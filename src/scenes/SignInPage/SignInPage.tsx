import React from "react";
import { Stack } from "@/components/Stack";
import { InputText } from "@/components/ui/InputText";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/Text";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { SigninPageProps } from "@/pages/signin";
import GithubButton from "./components/SocialButtons/GithubButton";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SignInForm = {
  email: string;
  password: string;
};

const SignInPage = ({ providers }: SigninPageProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>();
  const {
    query: { error },
  } = useRouter();

  const onSubmit = async (data: SignInForm) => {
    signIn("credentials", {
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spaceAfter="medium">
            <InputText
              label="Email"
              type="email"
              register={register}
              name="email"
              required
              error={errors.email?.message}
              registerOptions={{
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]+$/,
                  message: "Entered value does not match email format",
                },
              }}
            />
            <InputText
              label="Password"
              type="password"
              register={register}
              name="password"
              required
              error={errors.password?.message}
              registerOptions={{
                minLength: { value: 6, message: "Min length is 6" },
              }}
            />
            <Button asChild>
              <input type="submit" value="Sign in" />
            </Button>
          </Stack>
        </form>
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
