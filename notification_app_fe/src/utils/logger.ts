import { appConfig } from "../config.js";
import { getToken } from "./auth";

export async function logFrontend(level: string, pkg: string, msg: string) {
  try {
    const tok = await getToken();
    await fetch(`${appConfig.apiBase}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tok}`
      },
      body: JSON.stringify({
        stack: "frontend",
        level,
        package: pkg,
        message: msg
      })
    });
  } catch {
    // don't let logging errors affect the UI
  }
}
