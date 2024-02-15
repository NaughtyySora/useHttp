import { FC } from "react";
import { useHttp } from "./hooks/useHttp";

export const App: FC = () => {
  const { get, collect, post, } = useHttp("https://api.coingecko.com/api/v3/simple/price", { ids: "bitcoin", "vs_currencies": "usd" });
  return (
    <div className="App">
    </div>
  );
};