import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type SignInSchema = z.infer<typeof signinSchema>;
