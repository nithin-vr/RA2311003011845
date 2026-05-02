const typeWeight: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1
};

export function sortByPriority(items: any[]) {
  return [...items].sort((x, y) => {
    const wx = typeWeight[x.Type] ?? 0;
    const wy = typeWeight[y.Type] ?? 0;
    if (wx !== wy) return wy - wx;
    return new Date(y.Timestamp).getTime() - new Date(x.Timestamp).getTime();
  });
}
