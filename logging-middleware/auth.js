import { appConfig } from "./config.js";

// cache token so we don't keep hitting auth endpoint
let cachedToken = null;

export async function getAuthToken() {
  if (cachedToken) return cachedToken;

  const resp = await fetch(`${appConfig.apiBase}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: appConfig.userEmail,
      name: appConfig.userName,
      rollNo: appConfig.userRoll,
      accessCode: appConfig.accessCode,
      clientID: appConfig.clientId,
      clientSecret: appConfig.clientSecret
    })
  });

  const result = await resp.json();
  cachedToken = result.access_token;
  return cachedToken;
}
