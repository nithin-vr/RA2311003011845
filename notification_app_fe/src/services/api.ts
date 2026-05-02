import { appConfig } from "../config.js";
import { getToken, clearToken } from "../utils/auth";

// Central function for fetching notifications from the API.
// Supports pagination and optional filtering by notification type.
// If the token is expired, it clears it and retries once with a fresh one.
export async function fetchNotifications(page = 1, limit = 10, notificationType = "") {
  const token = await getToken();

  let url = `${appConfig.apiBase}/notifications?page=${page}&limit=${limit}`;
  if (notificationType) url += `&notification_type=${notificationType}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();

  // If the server says the token is invalid, wipe it and try once more with a fresh one
  if (data.message === "invalid authorization token") {
    clearToken();
    const freshToken = await getToken();
    const retryResponse = await fetch(url, {
      headers: { Authorization: `Bearer ${freshToken}` }
    });
    return retryResponse.json();
  }

  return data;
}
