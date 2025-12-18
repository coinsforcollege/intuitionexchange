'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

// Sidebar dimensions (must match DashboardLayout)
const SIDEBAR_WIDTH_EXPANDED = 288;
const SIDEBAR_WIDTH_COLLAPSED = 72;

interface SidebarContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarWidth: number;
  contentWidth: number;
  /** Effective "desktop" check accounting for sidebar */
  isEffectiveDesktop: boolean;
  /** Effective "tablet" check */
  isEffectiveTablet: boolean;
  /** Effective "mobile" check */
  isEffectiveMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType>({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  sidebarWidth: SIDEBAR_WIDTH_EXPANDED,
  contentWidth: 0,
  isEffectiveDesktop: false,
  isEffectiveTablet: false,
  isEffectiveMobile: true,
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileViewport = mounted ? !screens.md : true;
  const sidebarWidth = isMobileViewport ? 0 : (sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED);
  const contentWidth = windowWidth - sidebarWidth;

  // Effective breakpoints based on content width, not viewport width
  // These thresholds are for the actual content area
  const isEffectiveMobile = !mounted || contentWidth < 600;
  const isEffectiveTablet = mounted && contentWidth >= 600 && contentWidth < 900;
  const isEffectiveDesktop = mounted && contentWidth >= 900;

  return (
    <SidebarContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        sidebarWidth,
        contentWidth,
        isEffectiveDesktop,
        isEffectiveTablet,
        isEffectiveMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContext;

