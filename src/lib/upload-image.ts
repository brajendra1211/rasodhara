import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getUploadsRoot } from "@/lib/uploads";

export async function saveImageAsWebp(file: File, folder: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const webpBuffer = await sharp(Buffer.from(arrayBuffer))
    .webp({ quality: 82 })
    .toBuffer();

  const dir = path.join(getUploadsRoot(), folder);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.webp`;
  await writeFile(path.join(dir, filename), webpBuffer);

  return `/uploads/${folder}/${filename}`;
}

const MAX_VIDEO_SIZE_BYTES = 10 * 1024 * 1024;

const VIDEO_EXTENSIONS: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

export async function saveVideoFile(file: File, folder: string): Promise<string> {
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    throw new Error("Video is too large — please upload a file under 10MB.");
  }
  const extension = VIDEO_EXTENSIONS[file.type];
  if (!extension) {
    throw new Error("Unsupported video format — please upload MP4, WebM, or MOV.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const dir = path.join(getUploadsRoot(), folder);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}${extension}`;
  await writeFile(path.join(dir, filename), Buffer.from(arrayBuffer));

  return `/uploads/${folder}/${filename}`;
}
