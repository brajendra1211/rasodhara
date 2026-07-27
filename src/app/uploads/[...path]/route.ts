import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { NextResponse } from "next/server";
import { getUploadsRoot } from "@/lib/uploads";

const CONTENT_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;

  const root = getUploadsRoot();
  const filePath = path.join(root, ...segments);

  if (!filePath.startsWith(root + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()];
  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const fileStat = await stat(filePath);
    const range = req.headers.get("range");

    if (range) {
      const match = /bytes=(\d*)-(\d*)/.exec(range);
      const start = match?.[1] ? parseInt(match[1], 10) : 0;
      const end = match?.[2] ? parseInt(match[2], 10) : fileStat.size - 1;
      const data = await readFile(filePath);
      const chunk = data.subarray(start, end + 1);

      return new NextResponse(new Uint8Array(chunk), {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Range": `bytes ${start}-${end}/${fileStat.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunk.length),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const data = await readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Content-Length": String(fileStat.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
