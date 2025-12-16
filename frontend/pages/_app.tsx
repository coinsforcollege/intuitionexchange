import "@/styles/globals.css";
import "antd/dist/reset.css";
import { ConfigProvider, theme as antdTheme } from "antd";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import themeConfig from "@/theme/themeConfig";
import { ThemeProvider, useThemeMode } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ExchangeProvider } from "@/context/ExchangeContext";
import ErrorBoundary from "@/components/ErrorBoundary";

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

  // Handle unhandled promise rejections
  // Prevent overlay for user-friendly errors (so we can test user messages)
  // Let overlay show for unexpected errors (actual bugs)
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      
      // Check if this is a user-friendly/expected error
      if (error && typeof error === 'object') {
        const errorMessage = (error as any).message || '';
        const isUserFriendly = 
          errorMessage.includes('Unable to process') || 
          errorMessage.includes('Please try again') ||
          errorMessage.includes('Insufficient balance') ||
          errorMessage.includes('Unable to connect') ||
          errorMessage.includes('Unable to process trade');
        
        if (isUserFriendly) {
          // Prevent overlay for user-friendly errors so we can test user messages
          // The error will be caught by try/catch and shown via message.error()
          event.preventDefault();
          if (process.env.NODE_ENV === 'development') {
            console.warn('User-friendly error (will be shown as message):', errorMessage);
          }
        }
        // Let other errors show overlay (actual bugs need debugging)
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ConfigProvider theme={themeWithAlgorithm}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <ErrorBoundary>
      <main className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <ExchangeProvider>
              <ThemedApp {...props} />
            </ExchangeProvider>
          </AuthProvider>
        </ThemeProvider>
      </main>
    </ErrorBoundary>
  );
}
