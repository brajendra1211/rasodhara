import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export async function saveImageAsWebp(file: File, folder: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const webpBuffer = await sharp(Buffer.from(arrayBuffer))
    .webp({ quality: 82 })
    .toBuffer();

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.webp`;
  await writeFile(path.join(dir, filename), webpBuffer);

  return `/uploads/${folder}/${filename}`;
}
