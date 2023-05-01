import { z } from "zod";

export const editStepSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(100),
});

export const deleteStepSchema = z.object({
  id: z.number().int().positive(),
});

export type IEditStepSchema = z.infer<typeof editStepSchema>;
export type IDeleteStepSchema = z.infer<typeof deleteStepSchema>;
