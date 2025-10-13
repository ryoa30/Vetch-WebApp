import base64UrlToUint8Array from "../utils/base64Converter";
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";

export type SubscriptionJSON = PushSubscriptionJSON & { endpoint: string };

export class NotificationService {
  private http: HttpClient = new HttpClient({baseUrl: API_URL.NOTIFICATION});
  private swReg?: ServiceWorkerRegistration;
  constructor(private swPath = "/sw.js") {}

  /** Registers SW and ensures permission was granted */
  async init(): Promise<void> {
    if (!("serviceWorker" in navigator)) throw new Error("Service Worker unsupported");
    this.swReg = await navigator.serviceWorker.register(this.swPath);
  }

  async ensurePermission(): Promise<NotificationPermission> {
      console.log("asking for permission 1");
    const p = await window.Notification.requestPermission();
    console.log("result permission",p);
    if (p !== "granted") throw new Error("Notification permission denied");
    return p;
  }

  /** Subscribe to Web Push with your VAPID public key */
  async subscribe(vapidPublicKey: string, userId: string): Promise<PushSubscription> {
    if (!this.swReg) throw new Error("Call init() first");
    const appServerKey = base64UrlToUint8Array(vapidPublicKey);
    const sub = await this.swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: appServerKey,
    });
    // save to backend
    // await fetch("/api/push/subscribe", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(sub),
    // });
    const res = await this.http.post<IResponse>("/subscribe", {sub, userId});
    console.log("subscribe result", res);
    return sub;
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.swReg) return null;
    return this.swReg.pushManager.getSubscription();
  }

  async unsubscribe(): Promise<void> {
    const sub = await this.getSubscription();
    if (sub) {
    //   await fetch("/api/push/unsubscribe", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(sub),
    //   });
      await this.http.post<IResponse>("/unsubscribe", JSON.stringify(sub as SubscriptionJSON));
      await sub.unsubscribe();
    }
  }

  /** Debug helper to trigger a test push from server */
  async sendTest(): Promise<void> {
    // await fetch("/api/push/send", { method: "POST" });
    await this.http.post<IResponse>("/send");
  }
}