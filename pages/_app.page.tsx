import "antd/dist/reset.css";
import "../styles/globals.css";

import { ConfigProvider, theme } from "antd";
import { ThemeConfig } from "antd/es/config-provider/context";
import { NotificationProvider } from "context/notification";
import { AuthContextProvider } from "context/protect-route";
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
  // Use the layout defined at the page level, if available
  const GetLayout = Component.GetLayout ?? ((page) => page);

  const themeConfig: ThemeConfig = {
    components: {
      Pagination: {
        colorBgContainer: "var(--color-background-10)",
      },
      Button: {
        colorBgContainer: "var(--color-background-10)",
      },
      Menu: {
        colorBgContainer: "var(--color-background-10)",
      },
      Radio: {
        colorBgContainer: "var(--color-background-10)",
      },
      Card: {
        colorBgContainer: "var(--color-background-10)",
      },
      Input: {
        colorBgContainer: "#2c3345",
      },
      InputNumber: {
        colorBgContainer: "#2c3345",
      },
      Table: {
        colorBgContainer: "var(--color-background-10)",
      },
      Modal: {
        colorBgElevated: "var(--color-background-10)",
      },
      Notification: {
        colorPrimaryBg: "var(--color-background-10)",
      },
    },
    algorithm: [theme.darkAlgorithm],
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <NotificationProvider>
        <AuthContextProvider>
          {GetLayout(<Component {...pageProps} />)}
        </AuthContextProvider>
      </NotificationProvider>
    </ConfigProvider>
  );
}
