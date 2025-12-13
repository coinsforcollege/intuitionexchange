import React from "react";
import useSWR from "swr";
import { axiosInstance } from "util/axios";

type BalanceContext = {
  data: { code: string; unit: number }[];
  error: any;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

export const BalanceContext = React.createContext<BalanceContext>(
  {} as BalanceContext
);

export const BalanceContextProvider = ({ children }: { children: any }) => {
  const { data, error, isLoading, mutate } = useSWR("/balances", (url) =>
    axiosInstance.user
      .get<{ code: string; unit: number }[]>(url)
      .then((res) => res.data)
  );

  const refresh = async () => {
    await mutate();
  };

  return (
    <BalanceContext.Provider
      value={{ data: data ?? [], error, isLoading, refresh }}
    >
      {children}
    </BalanceContext.Provider>
  );
};
