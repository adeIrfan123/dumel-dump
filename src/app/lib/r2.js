import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

export const uploadToR2 = async (file, key) => {
  const buffer = Buffer.from(await file.arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  await r2.send(command);

  return key;
};

export const getR2SignUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(r2, command, {
    expiresIn: 300,
  });

  return url;
};

export const deleteFromR2 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2.send(command);
};
