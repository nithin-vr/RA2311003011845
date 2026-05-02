import { appConfig } from "../config.js";
import { getToken } from "../utils/auth";

export async function fetchNotifications(pageNum = 1, pageSize = 10, filterType = "") {
  const tok = await getToken();

  let endpoint = `${appConfig.apiBase}/notifications?page=${pageNum}&limit=${pageSize}`;
  if (filterType) endpoint += `&notification_type=${filterType}`;

  const resp = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${tok}` }
  });

  return resp.json();
}
