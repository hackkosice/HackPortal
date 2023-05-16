import * as z from "zod";

export const stepFormFieldsSchema = z.object({
  stepId: z.number().int().positive(),
});

export const saveFieldValuesSchema = z.array(
  z.object({
    fieldId: z.number().int().positive(),
    value: z.string().nonempty(),
  })
);
