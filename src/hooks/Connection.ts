export interface iRequestParams {
  body?: Document | XMLHttpRequestBodyInit | null | undefined;
  headers?: Record<string, string | number | boolean>;
  async?: boolean;
  password?: string;
  user?: string;
};

export type tMethods = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

export class Connection {
  xhr: XMLHttpRequest;
  method: string;
  url: URL;
  params: iRequestParams | undefined;

  constructor(url: URL, method: tMethods) {
    this.xhr = new XMLHttpRequest();
    this.method = method;
    this.url = url;
  }

  connect(params?: iRequestParams) {
    if (params) this.params = params;

    this.xhr.open(this.method, this.url, params?.async || true, params?.user, params?.password);

    if (params?.headers) {
      const entries = Object.entries(params);
      for (const [name, value] of entries) {
        this.xhr.setRequestHeader(name, value);
      }
    }

    this.xhr.send(params?.body || null);
  }

  abort(){
    this.xhr.abort();
  }

}