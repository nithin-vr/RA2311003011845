import { CONFIG } from "../config.js";
import { getToken } from "../utils/auth";

export async function fetchNotifications(page = 1, limit = 10, type = "") {
  const token = await getToken();
  let url = `${CONFIG.BASE_URL}/notifications?page=${page}&limit=${limit}`;
  if (type) url += `&notification_type=${type}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.json();
}
