// Placement is the most important type, Results are next, Events are the lowest
const NOTIFICATION_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1
};

// Extracts the two values we use to compare notifications against each other
function getScore(notification: any) {
  return {
    weight: NOTIFICATION_WEIGHT[notification.Type] ?? 0,
    timestamp: new Date(notification.Timestamp).getTime()
  };
}

// Returns true if notifA should be evicted before notifB
// (i.e. notifA has lower type weight, or same weight but is older)
function isWeakerThan(notifA: any, notifB: any): boolean {
  if (notifA.weight !== notifB.weight) return notifA.weight < notifB.weight;
  return notifA.timestamp < notifB.timestamp;
}

// Min-heap that holds at most k notifications.
// The root is always the weakest item in the current top-k,
// so we can quickly decide whether a new notification deserves a spot.
class MinHeap {
  private items: any[] = [];

  size() {
    return this.items.length;
  }

  // The root is the weakest — the one we'd replace first
  peekWeakest() {
    return this.items[0];
  }

  insert(notification: any) {
    this.items.push(notification);
    this.bubbleUp(this.items.length - 1);
  }

  removeWeakest(): any {
    const weakest = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0) {
      this.items[0] = last;
      this.sinkDown(0);
    }
    return weakest;
  }

  // Newly inserted item moves up until it's no longer weaker than its parent
  private bubbleUp(index: number) {
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

  // Root replacement sinks down until the heap property is restored
  private sinkDown(index: number) {
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

// Finds the top k most important notifications in O(n log k) time.
// Each notification is processed once — either added to the heap or discarded.
export function sortByPriority(notifications: any[], topK = notifications.length): any[] {
  const heap = new MinHeap();

  for (const notification of notifications) {
    const { weight, timestamp } = getScore(notification);
    const scoredNotification = { ...notification, weight, timestamp };

    if (heap.size() < topK) {
      // Still filling up the heap
      heap.insert(scoredNotification);
    } else if (!isWeakerThan(scoredNotification, heap.peekWeakest())) {
      // This one beats the current weakest — swap it in
      heap.removeWeakest();
      heap.insert(scoredNotification);
    }
    // Otherwise this notification doesn't make the top k, skip it
  }

  // Drain the heap and sort descending so rank #1 shows at the top
  const result: any[] = [];
  while (heap.size() > 0) result.push(heap.removeWeakest());

  return result.sort((a, b) => {
    if (a.weight !== b.weight) return b.weight - a.weight;
    return b.timestamp - a.timestamp;
  });
}
