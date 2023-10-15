export const LOCAL_STORAGE_APPLICATION_DATA = "applicationData";

export type LocalApplicationFieldData = {
  fieldId: number;
  value: string;
};

export type LocalApplicationData = LocalApplicationFieldData[];

export type LocalApplicationFieldDataParsed = {
  fieldId: number;
  value: string | boolean;
};
