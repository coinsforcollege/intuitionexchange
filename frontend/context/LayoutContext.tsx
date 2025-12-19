'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface ExchangeHeaderData {
  pair: string;
  price: number;
  change: number;
  volume?: string;
  iconUrl?: string;
  baseAsset?: string;
}

interface LayoutOptions {
  fullWidth: boolean;
  hideMobileNav: boolean;
  exchangeData: ExchangeHeaderData | null;
}

interface LayoutContextType {
  options: LayoutOptions;
  setFullWidth: (value: boolean) => void;
  setHideMobileNav: (value: boolean) => void;
  setExchangeData: (data: ExchangeHeaderData | null) => void;
  resetOptions: () => void;
}

const defaultOptions: LayoutOptions = {
  fullWidth: false,
  hideMobileNav: false,
  exchangeData: null,
};

const LayoutContext = createContext<LayoutContextType>({
  options: defaultOptions,
  setFullWidth: () => {},
  setHideMobileNav: () => {},
  setExchangeData: () => {},
  resetOptions: () => {},
});

export const useLayout = () => useContext(LayoutContext);

/**
 * Hook for pages to set layout options dynamically.
 * Options are automatically reset when the component unmounts.
 * Supports both initial options and dynamic updates via returned setters.
 */
export const useLayoutOptions = (initialOptions?: Partial<LayoutOptions>) => {
  const { setFullWidth, setHideMobileNav, setExchangeData, resetOptions } = useLayout();

  // Apply initial options on mount
  useEffect(() => {
    if (initialOptions?.fullWidth !== undefined) setFullWidth(initialOptions.fullWidth);
    if (initialOptions?.hideMobileNav !== undefined) setHideMobileNav(initialOptions.hideMobileNav);
    if (initialOptions?.exchangeData !== undefined) setExchangeData(initialOptions.exchangeData);

    // Reset to defaults on unmount
    return () => {
      resetOptions();
    };
  }, []); // Only run on mount/unmount

  // Return setters for dynamic updates during page lifecycle
  return { setFullWidth, setHideMobileNav, setExchangeData, resetOptions };
};

interface LayoutProviderProps {
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [options, setOptions] = useState<LayoutOptions>(defaultOptions);

  const setFullWidth = useCallback((value: boolean) => {
    setOptions(prev => ({ ...prev, fullWidth: value }));
  }, []);

  const setHideMobileNav = useCallback((value: boolean) => {
    setOptions(prev => ({ ...prev, hideMobileNav: value }));
  }, []);

  const setExchangeData = useCallback((data: ExchangeHeaderData | null) => {
    setOptions(prev => ({ ...prev, exchangeData: data }));
  }, []);

  const resetOptions = useCallback(() => {
    setOptions(defaultOptions);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        options,
        setFullWidth,
        setHideMobileNav,
        setExchangeData,
        resetOptions,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;

