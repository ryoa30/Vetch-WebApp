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

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.defaultHeaders,
      ...(init.headers as Record<string, string>),
    };

    const token = this.getToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, {
        ...init,
        headers,
        body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
        signal: controller.signal,
      });

      const text = await res.text();
      const body = text ? safeJson(text) : null;

      if (!res.ok) throw new HttpError(res.status, body, url);
      return body as T;
    }finally {
      clearTimeout(id);
    }
  }

  get<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, { method: "GET", ...(init ?? {}) });
  }

  getCatch<T>(path: string, init?: RequestInit) {
    try {
      return this.request<T>(path, { method: "GET", ...(init ?? {}) });
    } catch (error) {
      return error;
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
}

function safeJson(s: string) {
  try { return JSON.parse(s); } catch { return s; }
}
