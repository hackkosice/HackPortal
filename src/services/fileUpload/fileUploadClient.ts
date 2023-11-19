import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

if (
  !process.env.CLOUDFLARE_R2_ACCOUNT_ID ||
  !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
  !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
) {
  throw new Error("Missing Cloudflare R2 credentials");
}

const fileUploadClient = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export default fileUploadClient;
