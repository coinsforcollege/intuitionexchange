import { Result } from "antd";
import LoadingScreen from "components/loading-screen";
import React from "react";
import useSWR from "swr";
import { axiosInstance } from "util/axios";

export interface AssetInfo {
  CHANGE24HOUR: number;
  CHANGEDAY: number;
  CHANGEHOUR: number;
  CHANGEPCT24HOUR: number;
  CHANGEPCTDAY: number;
  CHANGEPCTHOUR: number;
  CIRCULATINGSUPPLY: number;
  CIRCULATINGSUPPLYMKTCAP: number;
  CONVERSIONSYMBOL: string;
  CONVERSIONTYPE: string;
  FLAGS: string;
  FROMSYMBOL: string;
  HIGH24HOUR: number;
  HIGHDAY: number;
  HIGHHOUR: number;
  IMAGEURL: string;
  LASTMARKET: string;
  LASTTRADEID: string;
  LASTUPDATE: number;
  LASTVOLUME: number;
  LASTVOLUMETO: number;
  LOW24HOUR: number;
  LOWDAY: number;
  LOWHOUR: number;
  MARKET: string;
  MEDIAN: number;
  MKTCAP: number;
  MKTCAPPENALTY: number;
  OPEN24HOUR: number;
  OPENDAY: number;
  OPENHOUR: number;
  PRICE: number;
  SUPPLY: number;
  TOPTIERVOLUME24HOUR: number;
  TOPTIERVOLUME24HOURTO: number;
  TOSYMBOL: string;
  TOTALTOPTIERVOLUME24H: number;
  TOTALTOPTIERVOLUME24HTO: number;
  TOTALVOLUME24H: number;
  TOTALVOLUME24HTO: number;
  TYPE: string;
  VOLUME24HOUR: number;
  VOLUME24HOURTO: number;
  VOLUMEDAY: number;
  VOLUMEDAYTO: number;
  VOLUMEHOUR: number;
  VOLUMEHOURTO: number;
}

type Pairs = { [key: string]: { [key: string]: AssetInfo } };

type ExchangeContext = {
  pairs: Pairs;
  refresh: () => Promise<void>;
};

export const ExchangeContext = React.createContext<ExchangeContext>(
  {} as ExchangeContext
);

export const ExchangeContextProvider = ({ children }: { children: any }) => {
  const { data, error, mutate } = useSWR("/tickers/", (url) =>
    axiosInstance.default.get<Pairs>(url).then((res) => res.data)
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
