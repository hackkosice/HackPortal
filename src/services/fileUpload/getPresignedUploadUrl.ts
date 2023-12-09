import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fileUploadClient from "@/services/fileUpload/fileUploadClient";

const MAX_FILE_SIZE_IN_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_IN_MB * 1024 * 1024; // 10 MB

const getPresignedUploadUrl = (key: string): Promise<string> => {
  return getSignedUrl(
    fileUploadClient,
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      ContentLength: MAX_FILE_SIZE,
    }),
    { expiresIn: 3600, signableHeaders: new Set(["content-length"]) }
  );
};

export default getPresignedUploadUrl;
