import React from "react";
import { useEffectOnce } from "usehooks-ts";

import { ApiUserInfo } from "../types";
import { axiosInstance } from "../util/axios";

type AuthContext = {
  RemoveToken(): Promise<void>;
  SetToken(token: string): Promise<void>;
  loading: boolean;
  refresh: () => Promise<void>;
  user?: ApiUserInfo;
};

export const AuthContext = React.createContext<AuthContext>({} as AuthContext);

export const AuthContextProvider = ({ children }: { children: any }) => {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<ApiUserInfo | undefined>(undefined);

  const refresh = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      await axiosInstance.user
        .get<ApiUserInfo>("/api/account/me")
        .then((res) => setUser(res.data))
        .catch(() => setUser(undefined));
    } else {
      setUser(undefined);
    }

    setLoading(false);
  };

  async function SetToken(token: string) {
    localStorage.setItem("token", token);
    await refresh();
  }

  async function RemoveToken() {
    localStorage.removeItem("token");
    setUser(undefined);
  }

  useEffectOnce(() => {
    refresh();
  });

  return (
    <AuthContext.Provider
      value={{
        RemoveToken,
        SetToken,
        loading: loading,
        refresh,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
