"use server";
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { currentUser } from "@/lib/auth";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY!,
  },
});

// comment out the import and use this for edge functions
// const generateFileName = (bytes = 32) => {
//   const array = new Uint8Array(bytes)
//   crypto.getRandomValues(array)
//   return [...array].map((b) => b.toString(16).padStart(2, "0")).join("")
// }

// export async function UploadImage({
//   content,
//   fileId,
// }: {
//   content: string
//   fileId?: number
// }): Promise<{ error: string } | undefined> {
//  const user=await currentUser()

//   if (!user) {
//     return { error: "not authenticated" }
//   }

//   if (content.length < 1) {
//     return { error: "not enough content" }
//   }

//   if (fileId) {
//     const result = await db
//       .select({ id: mediaTable.id })
//       .from(mediaTable)
//       .where(and(eq(mediaTable.id, fileId), eq(mediaTable.userId, session.user.id)))
//       .then((rows) => rows[0])

//     if (!result) {
//       return { failure: "image not found" }
//     }
//   }

//   const results = await db
//     .insert(postsTable)
//     .values({
//       content,
//       userId: session.user.id,
//     })
//     .returning()

//   if (fileId) {
//     await db.update(mediaTable).set({ postId: results[0].id }).where(eq(mediaTable.id, fileId))
//   }

//   revalidatePath("/")
//   redirect("/")
// }

const allowedFileTypes = [
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
  fileType: string;
  fileSize: number;
  filePath: string;
  checksum: string;
};
export const getSignedURL = async ({
  fileType,
  fileSize,
  filePath = "temp",
  checksum,
}: GetSignedURLParams): SignedURLResponse => {
  const user = await currentUser();

  if (!user) {
    return { error: "not authenticated" };
  }

  if (!allowedFileTypes.includes(fileType)) {
    return { error: "File type not allowed" };
  }

  if (fileSize > maxFileSize) {
    return { error: "File size too large" };
  }

  const fileName = generateFileName();

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: `${filePath}/${fileName}`,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
    Tagging: user.id,
  });

  const url = await getSignedUrl(
    s3Client,
    putObjectCommand,
    { expiresIn: 60 } // 60 seconds
  );

  return { success: url };
};

export async function deleteImage(url: string) {
  if (!url) return;

  const key = url.split("/").slice(-1)[0];

  const deleteParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
  };

  await s3Client.send(new DeleteObjectCommand(deleteParams));
}
