import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { trpc } from "@/services/trpc";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Stack } from "@/components/Stack";
import { InputText } from "@/components/InputText";
import { Button } from "@/components/Button";
import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";
import clearLocalApplicationData from "@/services/helpers/localData/clearLocalApplicationData";

type SignUpForm = {
  email: string;
  password: string;
};

const SignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>();

  const { mutateAsync } = trpc.signup.useMutation();

  const onSubmit = useCallback(
    async (data: SignUpForm) => {
      const localApplicationData = getLocalApplicationData();
      const result = await mutateAsync({
        ...data,
        localApplicationData,
      });
      if (result.status === 201) {
        clearLocalApplicationData();
        router.push("/application");
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
};

export default SignUp;
