import { CONFIG } from "../config.js";

let token: string | null = null;

async function getAuthToken(): Promise<string> {
  if (token) return token;

  const response = await fetch(`${CONFIG.BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: CONFIG.EMAIL,
      name: CONFIG.NAME,
      rollNo: CONFIG.ROLL_NO,
      accessCode: CONFIG.ACCESS_CODE,
      clientID: CONFIG.CLIENT_ID,
      clientSecret: CONFIG.CLIENT_SECRET
    })
  });

  const data = await response.json();
  token = data.access_token;
  return token as string;
}

export async function logFrontend(level: string, pkg: string, message: string) {
  try {
    const t = await getAuthToken();
    await fetch(`${CONFIG.BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`
      },
      body: JSON.stringify({ stack: "frontend", level, package: pkg, message })
    });
  } catch {
    // silently fail
  }
}
