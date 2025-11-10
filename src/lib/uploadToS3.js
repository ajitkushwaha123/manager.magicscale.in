import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadToS3(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;
  const contentType = file.type;
  const Bucket = process.env.AWS_S3_BUCKET;

  try {
    const command = new PutObjectCommand({
      Bucket,
      Key: `emails/attachments/${fileName}`,
      Body: buffer,
      ContentType: contentType,
    });

    await s3.send(command);

    // Return public URL (if bucket is public)
    const url = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/emails/attachments/${fileName}`;

    return {
      filename: file.name,
      path: url,
      contentType,
    };
  } catch (err) {
    console.error("❌ S3 upload failed:", err);
    throw err;
  }
}
