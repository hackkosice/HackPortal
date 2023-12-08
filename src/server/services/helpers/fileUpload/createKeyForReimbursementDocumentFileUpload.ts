import "server-only";

type CreateKeyForReimbursementDocumentFileUploadInput = {
  hackerId: number;
};
const createKeyForReimbursementDocumentFileUpload = ({
  hackerId,
}: CreateKeyForReimbursementDocumentFileUploadInput) => {
  return `reimbursement-documents/hacker-${hackerId}`;
};

export default createKeyForReimbursementDocumentFileUpload;
