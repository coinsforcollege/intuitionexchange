import React from "react";

type ResponsiveContext = {
  isDarkMode: boolean;
  setDarkMode: (state: boolean) => void;
};

export const ResponsiveContext = React.createContext<ResponsiveContext>(
  {} as ResponsiveContext
);
