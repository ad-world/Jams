export function useSerialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
