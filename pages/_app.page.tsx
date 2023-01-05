import "antd/dist/reset.css";
import "../styles/globals.css";

import { ConfigProvider, theme } from "antd";
import { ThemeConfig } from "antd/es/config-provider/context";
import useMediaQuery from "components/useMediaQuery";
import { NotificationProvider } from "context/notification";
import { AuthContextProvider } from "context/protect-route";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import React, { ReactElement, ReactNode } from "react";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  GetLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [darkMode, setDarkMode] = React.useState(false);

  // Use the layout defined at the page level, if available
  const GetLayout = Component.GetLayout ?? ((page) => page);
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);

  const themeConfig: ThemeConfig = {
    algorithm: darkMode ? [theme.darkAlgorithm] : [theme.defaultAlgorithm],
  };

  React.useEffect(() => {
    setDarkMode(isDarkOS);
  }, [isDarkOS]);

  return (
    <ConfigProvider theme={themeConfig}>
      <NotificationProvider>
        <AuthContextProvider>{GetLayout(<Component {...pageProps} />)}</AuthContextProvider>
      </NotificationProvider>
    </ConfigProvider>
  );
}
