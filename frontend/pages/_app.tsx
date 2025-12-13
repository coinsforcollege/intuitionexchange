import "@/styles/globals.css";
import "antd/dist/reset.css";
import { ConfigProvider, theme as antdTheme } from "antd";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import themeConfig from "@/theme/themeConfig";
import { ThemeProvider, useThemeMode } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

function ThemedApp({ Component, pageProps }: AppProps) {
  const { mode } = useThemeMode();

  const themeWithAlgorithm = {
    ...themeConfig,
    algorithm: mode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  return (
    <ConfigProvider theme={themeWithAlgorithm}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <main className={inter.className}>
      <ThemeProvider>
        <AuthProvider>
          <ThemedApp {...props} />
        </AuthProvider>
      </ThemeProvider>
    </main>
  );
}
