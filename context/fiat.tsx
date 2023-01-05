import React from "react";
import useSWR from "swr";
import { ApiFiatTotals } from "types";
import { axiosInstance } from "util/axios";

type FiatContext = {
  data: ApiFiatTotals | undefined;
  error: any;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

export const FiatContext = React.createContext<FiatContext>({} as FiatContext);

export const FiatContextProvider = ({ children }: { children: any }) => {
  const { data, error, isLoading, mutate } = useSWR("/api/fiat/totals", (url) =>
    axiosInstance.user.get<ApiFiatTotals>(url).then((res) => res.data)
  );

  const refresh = async () => {
    await mutate();
  };

  return (
    <FiatContext.Provider value={{ data, error, isLoading, refresh }}>
      {children}
    </FiatContext.Provider>
  );
};
