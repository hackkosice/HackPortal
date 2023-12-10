"use server";

import getPresignedUploadUrl from "@/services/fileUpload/getPresignedUploadUrl";

const MAX_FILE_SIZE_IN_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_IN_MB * 1024 * 1024; // 10 MB

type RequestFileUploadUrlInput = {
  key: string;
  fileSize: number;
};
const requestFileUploadUrl = async ({
  key,
  fileSize,
}: RequestFileUploadUrlInput): Promise<{
  url: string;
}> => {
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error(
      `File size is too large. File size must be less than ${MAX_FILE_SIZE_IN_MB} MB.`
    );
  }
  return {
    url: await getPresignedUploadUrl(key, fileSize),
  };
};

export default requestFileUploadUrl;
