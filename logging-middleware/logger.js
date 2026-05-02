import { CONFIG } from "./config.js";
import { getAuthToken } from "./auth.js";

export async function Log(stack, level, pkg, message) {
  try {
    const token = await getAuthToken();

    await fetch(`${CONFIG.BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        stack: stack,
        level: level,
        package: pkg,
        message: message
      })
    });
  } catch (err) {
    // silently fail
  }
}
