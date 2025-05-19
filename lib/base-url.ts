export default function getBaseURL() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.BASE_URL}`;
  return "http://localhost:3000";
}
