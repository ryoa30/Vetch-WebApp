// /lib/http/HttpClient.ts
export type HttpClientOptions = {
  baseUrl: string;
  getToken?: () => string | undefined; // optional auth
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
};

export class HttpError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    public url: string
  ) {
    super(`HTTP ${status} for ${url}`);
    this.name = "HttpError";
  }
}

function safeJson(s: string) {
  try { return JSON.parse(s); } catch { return s; }
}

const isURLSearchParams = (v: any): v is URLSearchParams =>
  typeof URLSearchParams !== "undefined" && v instanceof URLSearchParams;

export class HttpClient {
  private baseUrl: string;
  private getToken?: () => string | undefined;
  private defaultHeaders: Record<string, string>;
  private timeoutMs: number;

  constructor(opts: HttpClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/+$/, "");
    this.getToken = opts.getToken;
    this.defaultHeaders = opts.defaultHeaders ?? {};
    this.timeoutMs = opts.timeoutMs ?? 15000;
  }

  async request<T>(
    path: string,
    init: RequestInit & { json?: unknown } = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

    // Decide body
    const hasExplicitBody = Object.prototype.hasOwnProperty.call(init, "body");
    const isJsonMode = !hasExplicitBody && init.json !== undefined;

    const body: BodyInit | undefined = hasExplicitBody
      ? (init.body as BodyInit)
      : isJsonMode
      ? (JSON.stringify(init.json) as BodyInit)
      : undefined;

    // Build headers; don't force Content-Type for multipart or Blob
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(init.headers as Record<string, string>),
    };

    // Only set Content-Type automatically when it's clearly JSON or URL-encoded.
    const contentTypeAlreadySet = Object.keys(headers)
      .some(h => h.toLowerCase() === "content-type");

    if (!contentTypeAlreadySet) {
      if (isJsonMode) {
        headers["Content-Type"] = "application/json";
      } else if (isURLSearchParams(body)) {
        headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
      }
      // NOTE: For FormData and Blob/ArrayBuffer, do NOT set Content-Type.
      // The browser/Fetch will set correct boundaries or type automatically.
    }

    // Auth
    const res = await fetch("/api/token", {
      method: "GET",
      credentials: "include", // include session cookies
      cache: "no-store",
    });
    const token = await res.json().then((data) => data.token);
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Timeout
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, {
        ...init,
        headers,
        body,
        signal: controller.signal,
      });

      const text = await res.text();
      const parsed = text ? safeJson(text) : null;

      if (!res.ok) throw new HttpError(res.status, parsed, url);
      return parsed as T;
    } catch(error){
      // console.log("fetch error",(error as string).toString().includes("401"));
      if((error as string).toString().includes("401")){
        console.log("Unauthorized! Refreshing token...");
        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/token/refresh", {
          method: "POST",
          credentials: "include", // include session cookies)
        })
        const response = await res.json();
        if(response.ok){
          console.log(response);
          await fetch("/api/session/setToken", {
            method: "POST",
            credentials: "include", // include session cookies
            cache: "no-store",
            body: JSON.stringify({ accessToken: response.accessToken }),
          });
          console.log("Token refreshed. Retrying original request...");
          const finalRes = await this.request<T>(path, init);
          console.log("Retried request successful.", finalRes);
          return finalRes as T;
        }else{
          await fetch("/api/logout", {
            method: "GET",
            credentials: "include", // include session cookies
            cache: "no-store",
          });
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    } 
    finally {
      clearTimeout(id);
    }
  }

  get<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, { method: "GET", ...(init ?? {}) });
  }

  // fixed: properly catches async errors
  async getCatch<T>(path: string, init?: RequestInit): Promise<T | Error> {
    try {
      return await this.request<T>(path, { method: "GET", ...(init ?? {}) });
    } catch (err: any) {
      return err;
    }
  }

  post<T>(path: string, json?: unknown, init?: RequestInit) {
    return this.request<T>(path, { method: "POST", json, ...(init ?? {}) });
  }
  put<T>(path: string, json?: unknown, init?: RequestInit) {
    return this.request<T>(path, { method: "PUT", json, ...(init ?? {}) });
  }
  delete<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, { method: "DELETE", ...(init ?? {}) });
  }

  // Convenience: explicit multipart helper
  postForm<T>(path: string, form: FormData, init?: RequestInit) {
    return this.request<T>(path, { method: "POST", body: form, ...(init ?? {}) });
  }
  putForm<T>(path: string, form: FormData, init?: RequestInit) {
    return this.request<T>(path, { method: "PUT", body: form, ...(init ?? {}) });
  }

  // Convenience: x-www-form-urlencoded
  postUrlEncoded<T>(path: string, params: Record<string, string>, init?: RequestInit) {
    const body = new URLSearchParams(params);
    return this.request<T>(path, { method: "POST", body, ...(init ?? {}) });
  }
}
