export function compareWithMultiple(toCompare: any, ...compareWith: any[]) {
  const results = compareWith.map(nowCompareWith => toCompare === nowCompareWith);

  return !results.some(r => !r);
}
