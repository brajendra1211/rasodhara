import path from "node:path";

/**
 * Root directory where uploaded files are stored on disk.
 *
 * Defaults to `public/uploads` for local dev. In production (cPanel/Passenger,
 * deployed via `git pull`), set UPLOADS_DIR to an absolute path outside the
 * git-managed app directory so uploaded files survive future deploys.
 */
export function getUploadsRoot(): string {
  return process.env.UPLOADS_DIR
    ? path.resolve(process.env.UPLOADS_DIR)
    : path.join(process.cwd(), "public", "uploads");
}
