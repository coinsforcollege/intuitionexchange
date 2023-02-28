import React from "react";

type ResponsiveContext = {
  isDarkMode: boolean;
};

export const ResponsiveContext = React.createContext<ResponsiveContext>(
  {} as ResponsiveContext
);
