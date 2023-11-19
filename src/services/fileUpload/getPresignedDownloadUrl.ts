import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import fileUploadClient from "@/services/fileUpload/fileUploadClient";

const getPresignedDownloadUrl = (key: string): Promise<string> => {
  return getSignedUrl(
    fileUploadClient,
    new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 3600 }
  );
};

export default getPresignedDownloadUrl;
