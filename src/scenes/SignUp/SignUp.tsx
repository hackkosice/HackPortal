import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { trpc } from "@/services/trpc";
import { Stack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";
import clearLocalApplicationData from "@/services/helpers/localData/clearLocalApplicationData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signupSchema, SignUpSchema } from "@/server/services/validation/auth";
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

const SignUp = () => {
  const router = useRouter();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signupSchema),
  });

  const { mutateAsync } = trpc.signup.useMutation();

  const onSubmit = useCallback(
    async (data: SignUpSchema) => {
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack direction="column">
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
                        placeholder="New password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Sign up</Button>
            </Stack>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUp;
