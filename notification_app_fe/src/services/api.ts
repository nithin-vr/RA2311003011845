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

export async function fetchNotifications(page = 1, limit = 10, type = "") {
  const t = await getAuthToken();
  let url = `${CONFIG.BASE_URL}/notifications?page=${page}&limit=${limit}`;
  if (type) url += `&notification_type=${type}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${t}` }
  });

  return res.json();
}
