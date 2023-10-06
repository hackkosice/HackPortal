import React from "react";
import { Stack } from "@/components/Stack";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { InputText } from "@/components/InputText";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { LoginPageProps } from "@/pages/login";
import GithubButton from "./components/SocialButtons/GithubButton";

type LoginForm = {
  email: string;
  password: string;
};

const LoginPage = ({ providers }: LoginPageProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const {
    query: { error },
  } = useRouter();

  const onSubmit = async (data: LoginForm) => {
    signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/application",
    });
  };

  return (
    <Card>
      <Heading spaceAfter="large" centered>
        Sign in
      </Heading>
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
          <Button label="Sign in" type="submit" />
        </Stack>
      </form>
      <Stack direction="column">
        <Button
          label="Sign up"
          colorType="secondary"
          type="buttonLink"
          href="/signup"
        />
        {Object.keys(providers).includes("github") && (
          <GithubButton onClick={() => signIn("github")} />
        )}
      </Stack>
    </Card>
  );
};

export default LoginPage;
