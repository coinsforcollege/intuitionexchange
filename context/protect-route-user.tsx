import { NotFoundComponent } from "components/not-found";
import { useRouter } from "next/router";
import React from "react";

import LoadingScreen from "../components/loading-screen";
import { ApiUserInfo, Flags } from "../types";
import { BalanceContextProvider } from "./balance";
import { AuthContext } from "./protect-route";

type UserAuthContext = {
  loading: boolean;
  refresh: () => Promise<void>;
  user: ApiUserInfo;
};

export const UserAuthContext = React.createContext<UserAuthContext>(
  {} as UserAuthContext
);

export const UserAuthContextProvider = ({
  children,
  isAdmin,
}: {
  children: any;
  isAdmin?: true;
}) => {
  const router = useRouter();
  const { loading, refresh, user } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (router.isReady && !loading) {
      if (!user) {
        router.push({
          pathname: "/login",
          query: { redirect: router.asPath },
        });
      } else if (!user.kyc) {
        router.push({
          pathname: "/onboarding",
        });
      }
    }
  }, [router.isReady, loading, user]);

  if (!router.isReady || !user || !user.kyc) {
    return <LoadingScreen />;
  }

  if (isAdmin && !(user.flags & Flags.Admin)) {
    return <NotFoundComponent />;
  }

  return (
    <UserAuthContext.Provider value={{ loading, user, refresh }}>
      <BalanceContextProvider>{children}</BalanceContextProvider>
    </UserAuthContext.Provider>
  );
};
