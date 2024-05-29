"use server";
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { currentUser } from "@/lib/auth";

const client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY!,
  },
});

const allowedFileTypes = [
  "audio/wav",
  "image/jpeg",
  "image/png",
  "video/mp4",
  "video/quicktime",
];

const maxFileSize = 1048576 * 10; // 1 MB

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

type SignedURLResponse = Promise<
  | { error?: undefined; success: string }
  | { error: string; success?: undefined }
>;

type GetSignedURLParams = {
  oldFile?: string | null;
  fileType: string;
  fileSize: number;
  filePath: string;
  checksum: string;
};
export const getSignedURL = async ({
  oldFile,
  fileType,
  fileSize,
  filePath = "temp",
  checksum,
}: GetSignedURLParams): SignedURLResponse => {
  const user = await currentUser();

  if (!user) return { error: "not authenticated" };

  if (!allowedFileTypes.includes(fileType))
    return { error: "File type not allowed" };

  if (fileSize > maxFileSize) return { error: "File size too large" };

  const fileName = generateFileName();
  const key = `${filePath}/${fileName}.${fileType.split("/").slice(-1)[0]}`;

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
    Tagging: user.id,
  });

  const url = await getSignedUrl(
    client,
    putObjectCommand,
    { expiresIn: 60 } // 60 seconds
  );

  if (oldFile) await deleteImage(oldFile, filePath);

  return { success: url };
};

export async function deleteImage(url: string, filePath: string = "temp") {
  if (!url) return;

  const filename = url.split("/").slice(-1)[0];
  const key = `${filePath}/${filename}`;

  const deleteParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
  };
  //  return deleteParams
  await client.send(new DeleteObjectCommand(deleteParams));
}
