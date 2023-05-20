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
import { useEffectOnce } from "usehooks-ts";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  GetLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [isDarkMode, setDarkMode] = React.useState(true);

  // Use the layout defined at the page level, if available
  const GetLayout = Component.GetLayout ?? ((page) => page);

  const themeConfig: ThemeConfig = {
    token: {
      colorBgContainer: isDarkMode ? "#1e2433" : "#ffffff",
      colorBgElevated: isDarkMode ? "#454c5e" : "#ffffff",
      colorBorderSecondary: isDarkMode ? "#ffffff10" : "#00000020",
      colorBorder: isDarkMode ? "#ffffff10" : "#00000020",
      colorText: "inherit",
      colorLink: "inherit",
    },
    algorithm: [isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm],
  };

  function HandleThemeChange(e: MediaQueryListEvent) {
    document.documentElement.setAttribute(
      "data-theme",
      e.matches ? "dark" : "light"
    );
  }

  useEffectOnce(() => {
    setDarkMode(document.documentElement.getAttribute("data-theme") === "dark");

    // MediaQueryList
    const darkModePreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    // recommended method for newer browsers: specify event-type as first argument
    darkModePreference.addEventListener("change", HandleThemeChange);

    return () => {
      darkModePreference.removeEventListener("change", HandleThemeChange);
    };
  });

  function ToggleTheme(state?: boolean) {
    const mode = state ?? !isDarkMode;
    setDarkMode(mode);
    document.documentElement.setAttribute(
      "data-theme",
      mode ? "dark" : "light"
    );

    window.localStorage.setItem("theme", mode ? "dark" : "light");
  }

  return (
    <ResponsiveContext.Provider
      value={{
        isDarkMode: isDarkMode,
        setDarkMode: (state) => ToggleTheme(state),
      }}
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
