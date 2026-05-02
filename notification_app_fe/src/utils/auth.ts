import { CONFIG } from "../config.js";

let token: string | null = null;

export async function getToken(): Promise<string> {
  if (token) return token;

  const res = await fetch(`${CONFIG.BASE_URL}/auth`, {
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

  const data = await res.json();
  token = data.access_token;
  return token as string;
}
