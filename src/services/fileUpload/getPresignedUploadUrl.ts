import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fileUploadClient from "@/services/fileUpload/fileUploadClient";

const getPresignedUploadUrl = (
  key: string,
  contentLength: number
): Promise<string> => {
  return getSignedUrl(
    fileUploadClient,
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      ContentLength: contentLength,
    }),
    { expiresIn: 3600, signableHeaders: new Set(["content-length"]) }
  );
};

export default getPresignedUploadUrl;
