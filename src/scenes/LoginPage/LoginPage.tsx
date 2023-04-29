import { Stack } from "@/components/Stack";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { InputText } from "@/components/InputText";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";

type LoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
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
      callbackUrl: "/dashboard",
    });
  };

  return (
    <Card>
      <Heading spaceAfter="large" centered>
        Login
      </Heading>
      {error && (
        <Text spaceAfter="medium" type="error">
          {error === "CredentialsSignin" && "Invalid credentials"}
        </Text>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column">
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
              maxLength: { value: 10, message: "Max length is 10" },
            }}
          />
          <Button label="Log in" type="submit" />
        </Stack>
      </form>
      <br />
      <Link href="/signup">
        <Button label="Sign up" primary={false} />
      </Link>
    </Card>
  );
};

export default LoginPage;
