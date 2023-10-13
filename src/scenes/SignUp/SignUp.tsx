import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { trpc } from "@/services/trpc";
import { Stack } from "@/components/Stack";
import { InputText } from "@/components/ui/InputText";
import { Button } from "@/components/ui/button";
import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";
import clearLocalApplicationData from "@/services/helpers/localData/clearLocalApplicationData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
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
            <Button asChild>
              <input type="submit" value="Sign Up" />
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUp;
