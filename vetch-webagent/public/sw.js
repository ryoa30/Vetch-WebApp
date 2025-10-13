/* global self, clients */
self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch {}
  const title = data.title || "New notification";
  const options = {
    body: data.body || "",
    icon: data.icon || "/icons/192.png",
    badge: data.badge || "/icons/badge.png",
    data: { url: data.url || "/", ...data.data },
    tag: data.tag, // collapse by tag if you want
    renotify: !!data.renotify,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/";
  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
    const existing = allClients.find(c => c.url.includes(new URL(url, self.location.origin).pathname));
    if (existing) return existing.focus();
    return clients.openWindow(url);
  })());
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
