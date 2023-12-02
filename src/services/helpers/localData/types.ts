import { FormFieldType } from "@/services/types/formFields";

export const LOCAL_STORAGE_APPLICATION_DATA = "applicationData";

export type LocalApplicationFieldData = {
  fieldId: number;
  fieldType: FormFieldType;
  value: string;
};

export type LocalApplicationData = LocalApplicationFieldData[];

export type LocalApplicationFieldDataParsed = {
  fieldId: number;
  fieldType: FormFieldType;
  value: string | boolean;
};
