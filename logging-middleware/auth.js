import { CONFIG } from "./config.js";

let token = null;

export async function getAuthToken() {
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
  return token;
}
