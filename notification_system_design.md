# Notification System Design

## Stage 1 — Priority Notifications

### Approach

- Assign weight to each notification type:
  - Placement → 3
  - Result → 2
  - Event → 1
- Combine with timestamp (Unix ms)
- Sort notifications based on:
  - weight (descending)
  - timestamp (descending) — newer first on tie

### Efficient Approach — Min Heap

Instead of sorting the entire list every time, use a **Min Heap of size 10**:

**Steps:**
1. Insert notifications one by one into the heap
2. Maintain heap size = 10
3. When size exceeds 10, remove the smallest (lowest priority)

**Complexity:**
- Heap approach: `O(n log k)` where k = 10
- Sorting approach: `O(n log n)`

### Handling New Notifications

When a new notification arrives:
- Compare it with the smallest element in the heap
- If the new notification has higher priority → replace the smallest
- Otherwise → discard it

This makes the system efficient for real-time streaming of notifications.
