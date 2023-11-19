import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fileUploadClient from "@/services/fileUpload/fileUploadClient";

const getPresignedUploadUrl = (key: string): Promise<string> => {
  return getSignedUrl(
    fileUploadClient,
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 3600 }
  );
};

export default getPresignedUploadUrl;
