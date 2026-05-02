import { appConfig } from "../config.js";
import { getToken } from "./auth";

// Sends a log entry to the remote server in the background.
// This is intentionally fire-and-forget — logging should never slow down or break the UI.
export function logFrontend(level: string, pkg: string, message: string): void {
  getToken()
    .then(token =>
      fetch(`${appConfig.apiBase}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          stack: "frontend",
          level,
          package: pkg,
          message
        })
      })
    )
    .catch(() => {
      // Silently ignore logging failures — they should never affect the user experience
    });
}
