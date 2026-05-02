import fetch from "node-fetch";
import { Log } from "../logging-middleware/logger.js";
import { getAuthToken } from "../logging-middleware/auth.js";

// Placement notifications are the most critical, Results come next, Events are lowest priority
const PRIORITY_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1
};

// Converts a notification into something we can compare — weight tells us the type importance,
// timestamp tells us how recent it is
function getNotificationScore(notification) {
  return {
    weight: PRIORITY_WEIGHT[notification.Type] ?? 0,
    timestamp: new Date(notification.Timestamp).getTime()
  };
}

// We want the weakest item at the top of the heap so we can quickly evict it
// when a stronger notification comes in
function isWeakerThan(itemA, itemB) {
  if (itemA.weight !== itemB.weight) return itemA.weight < itemB.weight;
  return itemA.timestamp < itemB.timestamp;
}

// A min-heap that keeps only the top k strongest notifications.
// The root is always the weakest item currently in the heap,
// which makes it easy to decide whether a new notification deserves a spot.
class MinHeap {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.items = [];
  }

  size() {
    return this.items.length;
  }

  // The root is the weakest item — the one most likely to be replaced
  peekWeakest() {
    return this.items[0];
  }

  insert(notification) {
    this.items.push(notification);
    this.bubbleUp(this.items.length - 1);
  }

  removeWeakest() {
    const weakest = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0) {
      this.items[0] = last;
      this.sinkDown(0);
    }
    return weakest;
  }

  // After inserting at the end, move the item up until the heap property is restored
  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (isWeakerThan(this.items[index], this.items[parentIndex])) {
        [this.items[index], this.items[parentIndex]] = [this.items[parentIndex], this.items[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  // After replacing the root, push it down until the heap property is restored
  sinkDown(index) {
    const total = this.items.length;
    while (true) {
      let weakestIndex = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < total && isWeakerThan(this.items[leftChild], this.items[weakestIndex])) {
        weakestIndex = leftChild;
      }
      if (rightChild < total && isWeakerThan(this.items[rightChild], this.items[weakestIndex])) {
        weakestIndex = rightChild;
      }

      if (weakestIndex === index) break;

      [this.items[index], this.items[weakestIndex]] = [this.items[weakestIndex], this.items[index]];
      index = weakestIndex;
    }
  }
}

// Goes through all notifications and keeps only the top k using the min-heap.
// Time complexity: O(n log k) — much better than sorting everything when k is small.
function getTopNotifications(allNotifications, topK) {
  const heap = new MinHeap(topK);

  for (const notification of allNotifications) {
    const { weight, timestamp } = getNotificationScore(notification);
    const scoredNotification = { ...notification, weight, timestamp };

    if (heap.size() < topK) {
      // Heap isn't full yet, just add it
      heap.insert(scoredNotification);
    } else if (!isWeakerThan(scoredNotification, heap.peekWeakest())) {
      // This notification is stronger than the weakest one in our top-k, swap it in
      heap.removeWeakest();
      heap.insert(scoredNotification);
    }
    // If it's weaker than everything in the heap, we just skip it
  }

  // Pull everything out of the heap and sort for a clean ranked display
  const topNotifications = [];
  while (heap.size() > 0) topNotifications.push(heap.removeWeakest());

  return topNotifications.sort((a, b) => {
    if (a.weight !== b.weight) return b.weight - a.weight;
    return b.timestamp - a.timestamp;
  });
}

async function runStage1() {
  try {
    await Log("backend", "info", "handler", "Stage 1 started — fetching notifications from the evaluation API");

    const authToken = await getAuthToken();
    await Log("backend", "info", "auth", "Successfully obtained auth token");

    const response = await fetch("http://20.207.122.201/evaluation-service/notifications", {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const data = await response.json();
    await Log("backend", "info", "handler", `Fetched ${data.notifications.length} notifications from the API`);

    const top10 = getTopNotifications(data.notifications, 10);

    await Log("backend", "info", "handler", "Top 10 priority notifications computed using min-heap (O(n log k))");
    await Log("backend", "info", "handler", `Top 10 result: ${JSON.stringify(top10)}`);

    console.log("\nTop 10 Priority Notifications:\n");
    top10.forEach((notification, index) => {
      console.log(`${index + 1}. [${notification.Type}] ${notification.Message} — ${notification.Timestamp}`);
    });

  } catch (error) {
    await Log("backend", "error", "handler", `Stage 1 failed with error: ${error.message}`);
  }
}

runStage1();
