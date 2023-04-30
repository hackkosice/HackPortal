import { z } from "zod";

export const editStepSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(100),
});

export type IEditStepSchema = z.infer<typeof editStepSchema>;
