# Stage 1

## Problem
Users miss important notifications due to high volume.

## Solution
Priority Inbox using:
- Type weight (Placement > Result > Event)
- Recency

## Approach
- Assign weights: Placement = 3, Result = 2, Event = 1
- Sort by weight (descending), then timestamp (descending)

## Efficient Design
- Use Min Heap of size 10
- Time Complexity: O(n log k) instead of O(n log n)

## Handling New Notifications
- Compare with smallest in heap
- Replace if higher priority
- Otherwise discard
