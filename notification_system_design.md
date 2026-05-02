# Stage 1

## Problem
Students receive a high volume of campus notifications across three categories — Placements, Results, and Events. Important notifications get buried under less critical ones, causing students to miss time-sensitive updates.

## Solution
A Priority Inbox that always surfaces the top `n` most important notifications first, ranked by a combination of type weight and recency.

## Priority Rules
- **Type weight**: Placement (3) > Result (2) > Event (1)
- **Recency**: Among notifications of equal weight, the more recent one ranks higher
- This means a recent Placement always beats an older Placement, and any Placement beats any Result regardless of time

## Approach

### Scoring
Each notification gets two scores:
- `w` — type weight (3, 2, or 1)
- `t` — Unix timestamp in milliseconds

Two notifications are compared first by `w`, then by `t` as a tiebreaker.

### Algorithm — Min Heap of size k
Instead of sorting all notifications (O(n log n)), we maintain a min-heap of exactly `k` items where the root is always the weakest item currently in the top-k.

For each incoming notification:
1. If the heap has fewer than `k` items → push it in
2. If the heap is full and the new item beats the root (weakest in heap) → pop the root, push the new item
3. Otherwise → discard the new item

This gives **O(n log k)** time complexity, which is significantly faster when k << n.

### Handling New Notifications
When a new notification arrives in real time:
- Compare it against the heap's root (the weakest of the current top-k)
- If it's stronger → evict the root and insert the new one
- If it's weaker or equal → discard it
- The heap self-balances after each operation in O(log k)

## Complexity
| Operation | Complexity |
|---|---|
| Build top-k from n notifications | O(n log k) |
| Insert new notification | O(log k) |
| Read top-k | O(k log k) |

Compared to sorting all n notifications every time: O(n log n) — the heap approach is strictly better when k is small (e.g. k=10, n=1000+).

## Stage 2

The frontend is a Next.js (TypeScript) application running on `http://localhost:3000` with two pages:

- **/all** — paginated list of all notifications with filter by type (Placement / Result / Event) and read/unread tracking via localStorage
- **/priority** — priority inbox using the min-heap algorithm above, with a configurable top-N selector

Styling uses Material UI exclusively. Logging is integrated throughout using the shared logging middleware.
