import { z } from "zod";

export const editStepSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(100),
});

export const deleteStepSchema = z.object({
  id: z.number().int().positive(),
  force: z.boolean(),
});

export const stepInfoSchema = z.object({
  id: z.number().int().positive(),
});

export const newFormFieldSchema = z.object({
  stepId: z.number().int().positive(),
  label: z.string().nonempty(),
  name: z.string().nonempty(),
  typeId: z.number().int().positive(),
  required: z.boolean(),
});

export const deleteFormFieldSchema = z.object({
  id: z.number().int().positive(),
  force: z.boolean(),
});

export const applicationInfoSchema = z.object({
  id: z.number().int().positive(),
});

export type IEditStepSchema = z.infer<typeof editStepSchema>;
export type IDeleteStepSchema = z.infer<typeof deleteStepSchema>;
export type IStepInfoSchema = z.infer<typeof stepInfoSchema>;
