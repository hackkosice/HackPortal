import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { ISignUp } from "@/services/validation/auth";
import { trpc } from "@/services/trpc";
import React, { useCallback } from "react";
import { Card } from "@/components/Card";
import { InputText } from "@/components/InputText";
import { Button } from "@/components/Button";
import { Stack } from "@/components/Stack";
import { Heading } from "@/components/Heading";

export default function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUp>();

  const { mutateAsync } = trpc.signup.useMutation();

  const onSubmit = useCallback(
    async (data: ISignUp) => {
      const result = await mutateAsync(data);
      if (result.status === 201) {
        router.push("/login");
      } else if (result.status === 500) {
        console.log(result.message);
      }
    },
    [mutateAsync, router]
  );

  return (
    <Card>
      <Heading spaceAfter="large" centered>
        Sign Up
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column">
          <InputText
            label="Email"
            type="email"
            register={register}
            name="email"
            required
            error={errors.email?.message}
          />
          <InputText
            label="Password"
            type="password"
            register={register}
            name="password"
            required
            error={errors.password?.message}
          />
          <Button label="Sign up" type="submit" />
        </Stack>
      </form>
    </Card>
  );
}
