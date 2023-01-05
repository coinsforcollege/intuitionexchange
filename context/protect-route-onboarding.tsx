import { useRouter } from "next/router";
import React from "react";

import LoadingScreen from "../components/loading-screen";
import { ApiUserInfo } from "../types";
import { AuthContext } from "./protect-route";

type OnboardingAuthContext = {
  loading: boolean;
  refresh: () => Promise<void>;
  user: ApiUserInfo;
};

export const OnboardingAuthContext = React.createContext<OnboardingAuthContext>(
  {} as OnboardingAuthContext
);

export const OnboardingAuthContextProvider = ({
  children,
}: {
  children: any;
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
      }
    }
  }, [router.isReady, loading, user]);

  if (!router.isReady || !user) {
    return <LoadingScreen />;
  }

  return (
    <OnboardingAuthContext.Provider value={{ loading, user, refresh }}>
      {children}
    </OnboardingAuthContext.Provider>
  );
};
