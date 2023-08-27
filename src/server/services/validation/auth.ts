import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});
export type ILogin = z.infer<typeof loginSchema>;
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
