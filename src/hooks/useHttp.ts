import { useRef } from "react";
import { Connection, iRequestParams } from "./Connection";

interface iGetParams {
  parse?: boolean;
  callback?: (data: any) => void;
  setLoading?: (loading: boolean) => void;
  errorText?: string;
};

interface iOptions {
  throttle?: number,
  caching?: number,
  done: boolean,
  once: boolean,
};

const CACHE_KEY = "data";

export const useHttp = (url: string, params?: iRequestParams) => {
  const connection = new Connection(url);
  const cache = useRef<null | Map<string, any>>(null);
  const options = useRef<iOptions>({
    throttle: undefined,
    caching: undefined,
    done: false,
    once: false,
  });

  function get({ parse, callback, setLoading, errorText }: iGetParams = {}) {
    setThrottle();
    const once = options.current.once && options.current.done;
    const throttle = options.current.throttle && options.current.throttle <= 0;

    if (once || throttle) return Promise.resolve(null);
    if (cache.current?.has(CACHE_KEY)) return getFromCache(callback);
    connection.connect(params);

    return new Promise((resolve, reject) => {
      setLoading?.(true);
      connection.xhr.onload = (event: any) => {
        if (event.target.status !== 200) {
          const error = new Error(errorText || "Error while uploading data");
          setLoading?.(false);
          options.current.done = true;
          return reject(error);
        };

        const raw = event.target.response;
        const data = parse ? JSON.parse(event.target.response) : raw;
        saveToCache(data);
        callback?.(data);
        setLoading?.(false);
        options.current.done = true;
        return resolve(data);
      };
    });
  };

  const getFromCache = (callback: iGetParams["callback"]) => {
    const data = cache.current?.get(CACHE_KEY);
    callback?.(data);
    return Promise.resolve(data);
  };

  const saveToCache = (data: any) => {
    if (!options.current.caching) return;
    cache.current?.set(CACHE_KEY, data);
    setTimeout(() => {
      cache.current?.delete(CACHE_KEY);
    }, options.current.caching);
  };

  const setThrottle = () => {
    if (!options.current.throttle) return;
    options.current.throttle--;
  };

  return {
    get,
    cancel() {
      connection.abort();
      if (!options.current.done) options.current.done = true;
      return this;
    },
    once() {
      if (options.current.once) return this;
      options.current.once = true;
      return this;
    },
    caching(ms: number) {
      if (cache.current) return this;
      cache.current = new Map();
      options.current.caching = ms;
      return this;
    },
    throttle(amount: number, ms: number) {
      if (options.current.throttle !== null) return this;
      options.current.throttle = amount;

      const timeout = () => {
        const timer = setTimeout(() => {
          options.current.throttle = amount;
          clearTimeout(timer);
          timeout();
        }, ms);
      };

      timeout();
      return this;
    },
  };
};