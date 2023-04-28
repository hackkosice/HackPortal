import { Stack } from "@/components/Stack";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { InputText } from "@/components/InputText";
import { Button } from "@/components/Button";
import { useForm } from "react-hook-form";

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
  const onSubmit = (data: LoginForm) => console.log(data);

  return (
    <Card>
      <Heading spaceAfter="large" centered>
        Login
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
    </Card>
  );
};

export default LoginPage;
