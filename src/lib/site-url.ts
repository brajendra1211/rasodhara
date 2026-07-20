export function getBaseUrl(canonicalDomain: string | null) {
  if (canonicalDomain) {
    return canonicalDomain.replace(/\/$/, "");
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}
