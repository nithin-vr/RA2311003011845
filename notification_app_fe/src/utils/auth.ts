import { appConfig } from "../config.js";

let savedToken: string | null = null;

export async function getToken(): Promise<string> {
  if (savedToken) return savedToken;

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

  const json = await resp.json();
  savedToken = json.access_token;
  return savedToken as string;
}
