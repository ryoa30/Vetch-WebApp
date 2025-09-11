export function setWithExpiry(key: string, value: any, ttl: number) {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + ttl, // ms
  };

  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key);

  // If item doesn’t exist, return null
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  // Compare expiry time with current time
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key); // cleanup
    return null;
  }

  return item.value;
}