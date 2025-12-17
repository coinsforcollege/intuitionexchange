import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default to dark mode
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    // Check localStorage for saved preference, otherwise keep dark as default
    const saved = localStorage.getItem("theme-mode") as ThemeMode;
    if (saved) {
      setMode(saved);
    }
    // If no saved preference, dark mode remains as default
  }, []);

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme-mode", newMode);
  };

  const handleSetMode = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem("theme-mode", newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, setMode: handleSetMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return context;
}

