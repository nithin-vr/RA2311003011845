import fetch from "node-fetch";
import { Log } from "../logging-middleware/logger.js";
import { getAuthToken } from "../logging-middleware/auth.js";

const weightMap = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function getScore(notification) {
  const weight = weightMap[notification.Type];
  const time = new Date(notification.Timestamp).getTime();
  return { weight, time };
}

function compare(a, b) {
  if (a.weight !== b.weight) return b.weight - a.weight;
  return b.time - a.time;
}

async function getTopNotifications() {
  try {
    await Log("backend", "info", "handler", "Fetching notifications");

    const token = await getAuthToken();

    const response = await fetch(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await response.json();

    await Log("backend", "info", "handler", "Fetched notifications successfully");

    const notifications = data.notifications;

    const scored = notifications.map(n => {
      const { weight, time } = getScore(n);
      return { ...n, weight, time };
    });

    scored.sort(compare);

    const top10 = scored.slice(0, 10);

    await Log("backend", "info", "handler", "Computed top 10 notifications");

    console.log(top10);

  } catch (err) {
    await Log("backend", "error", "handler", "Error in processing notifications");
  }
}

getTopNotifications();
