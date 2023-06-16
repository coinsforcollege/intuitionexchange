import { Result } from "antd";
import LoadingScreen from "components/loading-screen";
import React from "react";
import useSWR from "swr";
import { axiosInstance } from "util/axios";

export interface TickerAsset {
  asset: string;
  base: string;
  openDay: number;
  pair: string;
  price: number;
}

type Pairs = { [key: string]: { [key: string]: TickerAsset } };

type ExchangeContext = {
  pairs: Pairs;
  refresh: () => Promise<void>;
};

export const ExchangeContext = React.createContext<ExchangeContext>(
  {} as ExchangeContext
);

export const ExchangeContextProvider = ({ children }: { children: any }) => {
  const { data, error, mutate } = useSWR(
    "/tickers/",
    (url) => axiosInstance.default.get<Pairs>(url).then((res) => res.data),
    {
      refreshInterval: 5000,
    }
  );

  const refresh = async () => {
    await mutate();
  };

  if (error) {
    return (
      <Result
        style={{ width: "100%" }}
        status="error"
        title="An unexpected error has occurred, please reload the page"
      />
    );
  }

  if (!data) {
    return <LoadingScreen />;
  }

  return (
    <ExchangeContext.Provider value={{ pairs: data, refresh }}>
      {children}
    </ExchangeContext.Provider>
  );
};
