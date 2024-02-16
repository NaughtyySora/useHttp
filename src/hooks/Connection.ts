export type tMethods = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

export interface iRequestParams {
  body?: Document | XMLHttpRequestBodyInit | null | undefined;
  headers?: Record<string, string | number | boolean>;
  async?: boolean;
  password?: string;
  user?: string;
  method: tMethods;
};

export class Connection {
  xhr: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    this.xhr = new XMLHttpRequest();
    this.url = url;
  }

  setHeaders(headers: iRequestParams["headers"]) {
    if (!headers) return;
    const entries = Object.entries(headers);
    for (const [name, value] of entries) {
      this.xhr.setRequestHeader(name, value.toString());
    }
  }

  connect(params?: iRequestParams) {
    this.xhr.open(params?.method || "GET", this.url, params?.async || true, params?.user, params?.password);
    this.setHeaders(params?.headers)
    this.xhr.send(params?.body || null);
  }

  abort() {
    this.xhr.abort();
  }
}