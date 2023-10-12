import * as z from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});
export type ISignIn = z.infer<typeof signinSchema>;
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
  localApplicationData: z
    .array(
      z.object({
        fieldId: z.number(),
        value: z.string(),
      })
    )
    .optional(),
});
export type ISignUp = z.infer<typeof signupSchema>;
