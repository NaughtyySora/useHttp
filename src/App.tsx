import { FC, useState } from "react";
import { useHttp } from "./hooks/useHttp";
import { prepareParams } from "./hooks/prepareParams";

const api = {
  base: "https://api.coingecko.com/api/v3/",
  price(searchParams: { ids: string, vs_currencies: string }) {
    return `${this.base}/simple/price${prepareParams(searchParams)}`
  },
};

export const App: FC = () => {
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const http = useHttp(api.price({ ids: "bitcoin", vs_currencies: "usd" }));

  const refetch = () => {
    http.get({parse: false, callback: setState, setLoading});
  }

  //!features
  //- collector collect(http) collector.keys(['a1', 'a2'])(http, http2) collector.pick ...
  //- parallel [http, http2, http3, http4];
  //- sequential [http, http2, http3, http4];

  return (
    <div className="App">
      {loading.toString()}
      <pre>{state}</pre>
      <button onClick={refetch}>Click to Refetch</button>
    </div>
  );
};

