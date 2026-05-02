import { appConfig } from "../config.js";

// Fetches and caches the auth token in sessionStorage so we don't hit the auth
// endpoint on every single API call. If the cached token turns out to be expired
// or invalid, we clear it and fetch a fresh one automatically.
export async function getToken(): Promise<string> {
  const cachedToken = sessionStorage.getItem("authToken");
  if (cachedToken) return cachedToken;
  return fetchFreshToken();
}

// Call this whenever an API response comes back with an auth error.
// It wipes the stale token so the next getToken() call fetches a new one.
export function clearToken(): void {
  sessionStorage.removeItem("authToken");
}

async function fetchFreshToken(): Promise<string> {
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
  sessionStorage.setItem("authToken", data.access_token);
  return data.access_token;
}
