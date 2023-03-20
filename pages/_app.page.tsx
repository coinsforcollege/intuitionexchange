import "antd/dist/reset.css";
import "../styles/globals.css";

import { ConfigProvider, theme } from "antd";
import { ThemeConfig } from "antd/es/config-provider/context";
import { NotificationProvider } from "context/notification";
import { AuthContextProvider } from "context/protect-route";
import { ResponsiveContext } from "context/responsive";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import React, { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  GetLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [darkMode, setDarkMode] = React.useState(true);

  // Use the layout defined at the page level, if available
  const GetLayout = Component.GetLayout ?? ((page) => page);

  const themeConfig: ThemeConfig = {
    token: {
      colorBgContainer: darkMode ? "#1e2433" : "#ffffff",
      colorBgElevated: darkMode ? "#1e2433" : "#ffffff",
      colorBorderSecondary: darkMode ? "#ffffff10" : "#00000020",
      colorBorder: darkMode ? "#ffffff10" : "#00000020",
    },
    algorithm: [darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm],
  };

  function HandleThemeChange(e: MediaQueryListEvent) {
    setDarkMode(e.matches);
    document.documentElement.setAttribute(
      "data-theme",
      e.matches ? "dark" : "light"
    );
  }

  React.useEffect(() => {
    const val = document.documentElement.getAttribute("data-theme");
    if (val === "light") {
      setDarkMode(false);
    }

    // MediaQueryList
    const darkModePreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    // recommended method for newer browsers: specify event-type as first argument
    darkModePreference.addEventListener("change", HandleThemeChange);

    return () => {
      darkModePreference.removeEventListener("change", HandleThemeChange);
    };
  }, []);

  return (
    <ResponsiveContext.Provider
      value={{ isDarkMode: darkMode, setDarkMode: setDarkMode }}
    >
      <ConfigProvider theme={themeConfig}>
        <NotificationProvider>
          <AuthContextProvider>
            {GetLayout(<Component {...pageProps} />)}
          </AuthContextProvider>
        </NotificationProvider>
      </ConfigProvider>
    </ResponsiveContext.Provider>
  );
}
