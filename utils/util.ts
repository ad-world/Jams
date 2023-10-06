export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export function sessionCode() {
  const max = 999999;
  const min = 100000;
  
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

