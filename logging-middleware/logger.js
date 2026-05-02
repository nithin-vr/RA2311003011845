import { appConfig } from "./config.js";
import { getAuthToken } from "./auth.js";

// sends a log entry to the remote logging service
export async function Log(stack, level, pkg, message) {
  try {
    const tok = await getAuthToken();

    await fetch(`${appConfig.apiBase}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tok}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });
  } catch (_err) {
    // intentionally silent — logging should never crash the app
  }
}
