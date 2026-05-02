import { appConfig } from "./config.js";
import { getAuthToken } from "./auth.js";

// Sends a structured log entry to the remote logging server.
// This function is intentionally silent on failure — a logging error should
// never interrupt the normal flow of the application.
export async function Log(stack, level, pkg, message) {
  try {
    const authToken = await getAuthToken();

    await fetch(`${appConfig.apiBase}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });
  } catch {
    // Swallow the error silently — logging must never crash the application
  }
}
