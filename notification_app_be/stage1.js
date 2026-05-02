import fetch from "node-fetch";
import { Log } from "../logging-middleware/logger.js";
import { getAuthToken } from "../logging-middleware/auth.js";

// higher number = more important
const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1
};

function buildScore(item) {
  const w = priorityMap[item.Type] ?? 0;
  const t = new Date(item.Timestamp).getTime();
  return { w, t };
}

function rankNotifications(a, b) {
  if (a.w !== b.w) return b.w - a.w;
  return b.t - a.t;
}

async function runStage1() {
  try {
    await Log("backend", "info", "handler", "Starting stage1 — fetching notifications from API");

    const tok = await getAuthToken();

    const resp = await fetch("http://20.207.122.201/evaluation-service/notifications", {
      headers: { Authorization: `Bearer ${tok}` }
    });

    const payload = await resp.json();
    await Log("backend", "info", "handler", "Notifications fetched successfully");

    const list = payload.notifications;

    // attach scores then sort
    const withScores = list.map(item => {
      const { w, t } = buildScore(item);
      return { ...item, w, t };
    });

    withScores.sort(rankNotifications);

    const topResults = withScores.slice(0, 10);

    await Log("backend", "info", "handler", "Top 10 computed successfully");
    await Log("backend", "info", "handler", `Result: ${JSON.stringify(topResults)}`);

  } catch (e) {
    await Log("backend", "error", "handler", "Stage1 failed while processing notifications");
  }
}

runStage1();
