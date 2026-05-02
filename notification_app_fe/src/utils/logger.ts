import { CONFIG } from "../config.js";
import { getToken } from "./auth";

export async function logFrontend(level: string, pkg: string, message: string) {
  try {
    const token = await getToken();
    await fetch(`${CONFIG.BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ stack: "frontend", level, package: pkg, message })
    });
  } catch {
    // silently fail
  }
}
