import * as z from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});
export type SignInSchema = z.infer<typeof signinSchema>;
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
export type SignUpSchema = z.infer<typeof signupSchema>;
