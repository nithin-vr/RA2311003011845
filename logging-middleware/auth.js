import { appConfig } from "./config.js";

// We cache the token in memory so we only hit the auth endpoint once per process run.
// Calling auth repeatedly for every log entry would be wasteful and slow.
let cachedAuthToken = null;

export async function getAuthToken() {
  if (cachedAuthToken) return cachedAuthToken;

  const response = await fetch(`${appConfig.apiBase}/auth`, {
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

  const data = await response.json();
  cachedAuthToken = data.access_token;
  return cachedAuthToken;
}
