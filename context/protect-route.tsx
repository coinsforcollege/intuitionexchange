import React from "react";

import { useUserStore } from "../store/user-store";
import { ApiUserInfo } from "../types";
import { axiosInstance } from "../util/axios";

type AuthContext = {
  loading: boolean;
  refresh: () => Promise<void>;
  user?: ApiUserInfo;
};

export const AuthContext = React.createContext<AuthContext>({} as AuthContext);

export const AuthContextProvider = ({ children }: { children: any }) => {
  const userStore = useUserStore();
  const [initialLoad, setInitialLoad] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState<ApiUserInfo | undefined>(undefined);

  const refresh = async () => {
    if (!userStore._hasHydrated || loading) return;
    setLoading(true);

    if (userStore.user) {
      await axiosInstance.user
        .get<ApiUserInfo>("/api/account/me")
        .then((res) => setUser(res.data))
        .catch(() => setUser(undefined));
    } else {
      setUser(undefined);
    }

    if (!initialLoad) {
      setInitialLoad(true);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    if (userStore._hasHydrated && !initialLoad) {
      refresh();
    }
  }, [userStore._hasHydrated]);

  React.useEffect(() => {
    if (initialLoad) {
      refresh();
    }
  }, [userStore.user]);

  return (
    <AuthContext.Provider
      value={{
        loading: !userStore._hasHydrated || loading || !initialLoad,
        refresh,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
