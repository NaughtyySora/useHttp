import { Connection, iRequestParams, tMethods } from "./Connection";
import { prepareParams, tURLParameters } from "./prepareParams";

export const useHttp = (path: string, searchParams?: tURLParameters) => {
  const url = new URL(`${path}${prepareParams(searchParams)}`);

  const parallel = () => {

  };

  const sequential = () => {

  };

  function execute(method: tMethods) {
    const connection = new Connection(url, method);
    const cache = new Map();
    let caching: number | undefined;
    let count: number | undefined;

    const promise = (params?: iRequestParams) => {
      if(typeof count === "number"){
        if(count <= 0) return Promise.resolve();
        count--;
      }

      if (cache.has("data")) return Promise.resolve(cache.get("data"));

      connection.connect(params);

      return new Promise((resolve, reject) => {
        connection.xhr.onload = (event: any) => {
          if (event.target.status !== 200) return reject(new Error("Error while uploading data"));

          if (caching) {
            cache.set("data", event.target.response);
            setTimeout(cache.delete, caching, "data");
          }
          return resolve(event.target.response);
        };
      });
    };

    promise.cancel = () => {
      connection.abort();
    };

    promise.timeout = (ms: number) => {
      setTimeout(promise.cancel, ms);
    };

    promise.caching = (ms: number) => {
      caching = ms;
    };

    promise.throttle = (value: number, ms: number) => {
      count = value;
      setInterval(() => {
        count = value;
      }, ms);
    };

    return promise;
  };

  const get = execute("GET");
  const post = execute("POST");

  const collect = async (fn: Function, params?: iRequestParams) => {
    try {
      const data = await get(params);
      const parsed = JSON.parse(data as string);
      fn(parsed);
    } catch (err) {
      console.log("Error while collecting data", err);
    }
  };

  return {
    get,
    post,
    execute,
    parallel,
    sequential,
    collect,
  };
};