import "server-only";

type CreateKeyForFormFileUploadInput = {
  stepId: number;
  fieldId: number;
  userId: number;
};
const createKeyForFormFileUpload = ({
  stepId,
  fieldId,
  userId,
}: CreateKeyForFormFileUploadInput) => {
  return `application-form/step-${stepId}/field-${fieldId}/user-${userId}`;
};

export default createKeyForFormFileUpload;
