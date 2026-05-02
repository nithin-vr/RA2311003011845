const weightMap: any = {
  Placement: 3,
  Result: 2,
  Event: 1
};

export function sortByPriority(notifications: any[]) {
  return [...notifications].sort((a, b) => {
    const w1 = weightMap[a.Type];
    const w2 = weightMap[b.Type];
    if (w1 !== w2) return w2 - w1;
    return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
  });
}
