'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { theme, Grid, Button, Badge, Dropdown, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  AppstoreOutlined,
  WalletOutlined,
  SwapOutlined,
  TeamOutlined,
  SettingOutlined,
  BellOutlined,
  MenuOutlined,
  CloseOutlined,
  PoweroffOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
  DollarOutlined,
  HistoryOutlined,
  LineChartOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { motion } from 'motion/react';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';
import { useSidebar } from '@/context/SidebarContext';
import { useLayout } from '@/context/LayoutContext';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

const { useToken } = theme;
const { useBreakpoint } = Grid;

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
  highlighted?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeKey?: string; // Optional override, otherwise derived from route
  fullWidth?: boolean;
  hideMobileNav?: boolean; // Hide mobile bottom nav (e.g., for trade page)
  exchangeData?: {
    pair: string;
    price: number;
    change: number;
    volume?: string;
    iconUrl?: string;
    baseAsset?: string;
  };
}

// Derive active key from pathname
const getActiveKeyFromPath = (pathname: string): string => {
  if (pathname.startsWith('/overview')) return 'overview';
  if (pathname.startsWith('/trade')) return 'trade';
  if (pathname.startsWith('/buy-sell')) return 'buy-sell';
  if (pathname.startsWith('/p2p')) return 'p2p';
  if (pathname.startsWith('/markets')) return 'markets';
  if (pathname.startsWith('/portfolio')) return 'portfolio';
  if (pathname.startsWith('/transactions')) return 'transactions';
  if (pathname.startsWith('/tuition-center')) return 'tuition-center';
  if (pathname.startsWith('/settings')) return 'settings';
  return 'overview';
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeKey: activeKeyProp,
  fullWidth: fullWidthProp,
  hideMobileNav: hideMobileNavProp,
  exchangeData: exchangeDataProp,
}) => {
  const router = useRouter();
  
  // Get layout options from context (set by pages dynamically)
  const { options: layoutOptions } = useLayout();
  
  // Merge props with context - props take precedence
  const fullWidth = fullWidthProp ?? layoutOptions.fullWidth;
  const hideMobileNav = hideMobileNavProp ?? layoutOptions.hideMobileNav;
  const exchangeData = exchangeDataProp ?? layoutOptions.exchangeData;
  
  // Derive activeKey from route, or use prop override if provided
  const activeKey = activeKeyProp ?? getActiveKeyFromPath(router.pathname);
  const { token } = useToken();
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebar();
  const [greeting, setGreeting] = useState('Welcome');
  const [appMode, setAppMode] = useState<'learner' | 'investor'>('investor');
  const [kycBannerDismissed, setKycBannerDismissed] = useState(() => {
    // Initialize from sessionStorage (persists across navigation but clears on sign out)
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('kycBannerDismissed') === 'true';
    }
    return false;
  });

  // Wait for client-side mount to avoid hydration mismatch with useBreakpoint
  const isMobile = mounted ? !screens.md : false;

  const isDark = mode === 'dark';
  const isLearnerMode = appMode === 'learner';

  // Set mounted, greeting, and load app mode on client side
  React.useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    // Load app mode from localStorage
    const savedMode = localStorage.getItem('appMode') as 'learner' | 'investor' | null;
    if (savedMode) {
      setAppMode(savedMode);
    }

    // Listen for storage changes (when mode is changed in settings)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appMode' && e.newValue) {
        setAppMode(e.newValue as 'learner' | 'investor');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also poll for changes within the same tab
    const interval = setInterval(() => {
      const currentMode = localStorage.getItem('appMode') as 'learner' | 'investor' | null;
      if (currentMode && currentMode !== appMode) {
        setAppMode(currentMode);
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [appMode]);

  // Scroll to top when route changes
  React.useEffect(() => {
    // Scroll to top on initial load and route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [router.asPath]);

  // Prevent back button from exiting dashboard to login/register pages
  React.useEffect(() => {
    const authRoutes = ['/login', '/register', '/reset', '/onboarding'];

    const handlePopState = () => {
      const targetPath = window.location.pathname;
      
      // If navigating to auth pages, redirect to overview instead
      if (authRoutes.some(route => targetPath === route || targetPath.startsWith(`${route}/`))) {
        router.replace('/overview');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  // Dimensions
  const SIDEBAR_WIDTH_EXPANDED = token.sizeXXL * 6; // 288px
  const SIDEBAR_WIDTH_COLLAPSED = 72; // Icons only
  const SIDEBAR_WIDTH = sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
  const HEADER_HEIGHT = token.controlHeightLG * 1.5;

  // Navigation items - clean, professional design
  const navItems: NavItem[] = [
    { key: 'overview', label: 'Overview', icon: <AppstoreOutlined />, href: '/overview', gradient: '' },
    { key: 'trade', label: 'Trade', icon: <SwapOutlined />, href: '/trade', gradient: '' },
    { key: 'buy-sell', label: 'Buy & Sell', icon: <ShoppingCartOutlined />, href: '/buy-sell', gradient: '' },
    { key: 'p2p', label: 'P2P', icon: <TeamOutlined />, href: '/p2p', gradient: '' },
    { key: 'markets', label: 'Markets', icon: <LineChartOutlined />, href: '/markets', gradient: '' },
    { key: 'portfolio', label: 'Portfolio', icon: <WalletOutlined />, href: '/portfolio', gradient: '' },
    { key: 'transactions', label: 'Transactions', icon: <HistoryOutlined />, href: '/transactions', gradient: '' },
    { key: 'tuition-center', label: 'Tuition Center', icon: <BookOutlined />, href: '/tuition-center', gradient: '', highlighted: true },
  ];

  // Brand accent color - changes based on mode
  // Learner: Warm coral palette (fun, friendly), Investor: Indigo theme
  const accentColor = isLearnerMode ? '#FF6B6B' : '#6366F1';
  const accentColorSecondary = isLearnerMode ? '#FF8E8E' : '#8B5CF6';

  const handleNavClick = (href: string) => {
    router.push(href);
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogout = async () => {
    // Clear KYC banner dismissal so it shows again on next login
    sessionStorage.removeItem('kycBannerDismissed');
    await logout();
    router.push('/login');
  };

  // Get display name for menus
  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || user?.email?.split('@')[0] || 'User';

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'email',
      label: (
        <div>
          <div style={{ fontWeight: fontWeights.semibold, color: token.colorText }}>
            {displayName}
          </div>
          {user?.kycStatus === 'APPROVED' ? (
            <div style={{ fontSize: token.fontSize, color: token.colorSuccess }}>
              ✓ Verified
            </div>
          ) : (
            <div 
              style={{ 
                fontSize: token.fontSize, 
                color: token.colorPrimary, 
                cursor: 'pointer',
              }}
              onClick={() => router.push('/onboarding')}
            >
              Complete verification →
            </div>
          )}
        </div>
      ),
      disabled: user?.kycStatus === 'APPROVED',
    },
    { type: 'divider' },
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined />, onClick: () => router.push('/settings') },
    { type: 'divider' },
    { key: 'logout', label: 'Log Out', icon: <PoweroffOutlined />, danger: true, onClick: handleLogout },
  ];

  // ============ STYLES ============

  // Sidebar background changes in learner mode for visual distinction
  const getSidebarBackground = () => {
    if (isLearnerMode) {
      return isDark 
        ? 'linear-gradient(180deg, #4A1C1C 0%, #2D1A2A 50%, #1A1625 100%)' // Dark coral to plum
        : 'linear-gradient(180deg, #E85555 0%, #FF6B6B 50%, #FF8E8E 100%)'; // Deeper coral gradient
    }
    return isDark ? '#0f0f14' : '#ffffff';
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: isMobile ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH,
    background: getSidebarBackground(),
    borderRight: `1px solid ${
      isLearnerMode 
        ? (isDark ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255,255,255,0.3)')
        : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')
    }`,
    display: 'flex',
    flexDirection: 'column',
    // On mobile, sidebar needs higher z-index than bottom nav (which uses token.zIndexPopupBase + 10)
    zIndex: isMobile ? token.zIndexPopupBase + 20 : token.zIndexPopupBase + 1,
    transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
  };

  const logoContainerStyle: React.CSSProperties = {
    minHeight: HEADER_HEIGHT,
    padding: sidebarCollapsed && !isMobile
      ? `${token.paddingMD}px ${token.paddingSM}px ${token.paddingSM}px`
      : `${token.paddingMD}px ${token.paddingMD}px ${token.paddingSM}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'space-between',
    flexShrink: 0,
  };

  const dividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: isLearnerMode ? 'rgba(255,255,255,0.2)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
    marginLeft: sidebarCollapsed && !isMobile ? token.paddingXS : token.paddingMD,
    marginRight: sidebarCollapsed && !isMobile ? token.paddingXS : token.paddingMD,
    marginTop: token.marginXS,
    marginBottom: token.marginXS,
    flexShrink: 0,
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginSM,
    textDecoration: 'none',
  };

  const logoTextStyle: React.CSSProperties = {
    fontSize: token.fontSizeXL,
    fontWeight: fontWeights.bold,
    color: isLearnerMode ? '#ffffff' : (isDark ? '#ffffff' : '#111827'),
    letterSpacing: '-0.02em',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    opacity: sidebarCollapsed && !isMobile ? 0 : 1,
    width: sidebarCollapsed && !isMobile ? 0 : 'auto',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
  };

  const navSectionStyle: React.CSSProperties = {
    flex: '1 1 0',
    minHeight: 0,
    padding: sidebarCollapsed && !isMobile 
      ? `${token.paddingSM}px ${token.paddingXS}px`
      : `${token.paddingSM}px ${token.paddingMD}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const getNavItemStyle = (item: NavItem, isActive: boolean): React.CSSProperties => {
    const activeBackground = isLearnerMode
      ? (isDark ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255, 255, 255, 0.25)')
      : (isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)');
    
    return {
      display: 'flex',
      alignItems: 'center',
      gap: token.marginSM,
      padding: sidebarCollapsed && !isMobile 
        ? `${token.paddingSM}px`
        : `${token.paddingSM}px ${token.paddingMD}px`,
      borderRadius: token.borderRadiusSM,
      background: isActive ? activeBackground : 'transparent',
      color: isActive 
        ? (isLearnerMode ? '#ffffff' : accentColor)
        : (isLearnerMode ? 'rgba(255,255,255,0.85)' : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)')),
      fontSize: token.fontSize,
      fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
    };
  };

  const navIconContainerStyle = (item: NavItem, isActive: boolean): React.CSSProperties => ({
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: token.fontSizeLG,
    color: 'inherit',
    transition: 'all 0.15s ease',
    flexShrink: 0,
  });

  const navLabelStyle: React.CSSProperties = {
    opacity: sidebarCollapsed && !isMobile ? 0 : 1,
    width: sidebarCollapsed && !isMobile ? 0 : 'auto',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
  };

  const bottomSectionStyle: React.CSSProperties = {
    padding: sidebarCollapsed && !isMobile
      ? `${token.paddingSM}px ${token.paddingXS}px ${token.paddingMD}px`
      : `${token.paddingSM}px ${token.paddingMD}px ${token.paddingMD}px`,
    flexShrink: 0,
  };

  const collapseButtonStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: SIDEBAR_WIDTH - 12, // Position at sidebar edge
    transform: 'translateY(-50%)',
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: isDark ? token.colorBgContainer : '#fff',
    border: `1px solid ${token.colorBorderSecondary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: token.zIndexPopupBase + 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: 12,
    color: token.colorTextSecondary,
  };

  const userCardStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginSM,
    padding: token.paddingSM,
    borderRadius: token.borderRadiusSM,
    background: isLearnerMode ? 'rgba(255,255,255,0.15)' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
    cursor: 'pointer',
    justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
  };

  const userAvatarStyle: React.CSSProperties = {
    width: token.controlHeightLG,
    height: token.controlHeightLG,
    borderRadius: '50%',
    background: isLearnerMode ? '#ffffff' : accentColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isLearnerMode ? '#FF6B6B' : '#ffffff',
    fontSize: token.fontSizeLG,
    fontWeight: fontWeights.bold,
    flexShrink: 0,
  };

  // Header
  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: isMobile ? 0 : SIDEBAR_WIDTH,
    right: 0,
    height: HEADER_HEIGHT,
    background: isLearnerMode 
      ? (isDark 
          ? 'linear-gradient(135deg, rgba(74, 28, 28, 0.85) 0%, rgba(45, 26, 42, 0.85) 100%)'
          : 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(78, 205, 196, 0.1) 100%)')
      : (isDark ? token.colorBgContainer : token.colorBgContainer),
    backdropFilter: isLearnerMode ? 'blur(20px)' : 'none',
    WebkitBackdropFilter: isLearnerMode ? 'blur(20px)' : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${token.paddingLG}px`,
    zIndex: token.zIndexPopupBase,
    borderBottom: isLearnerMode 
      ? `2px solid ${isDark ? 'rgba(255, 107, 107, 0.5)' : '#FF6B6B'}`
      : `1px solid ${token.colorBorderSecondary}`,
    boxShadow: isLearnerMode 
      ? (isDark ? '0 4px 30px rgba(255, 107, 107, 0.15)' : '0 4px 20px rgba(255, 107, 107, 0.1)')
      : 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const headerLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginMD,
  };

  const headerRightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginSM,
  };

  const welcomeStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  const welcomeTextStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    color: token.colorTextSecondary,
    lineHeight: 1.2,
  };

  const userNameStyle: React.CSSProperties = {
    fontSize: token.fontSizeLG,
    fontWeight: fontWeights.bold,
    color: token.colorText,
    lineHeight: 1.2,
  };

  const themeButtonStyle: React.CSSProperties = {
    width: token.controlHeight,
    height: token.controlHeight,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: token.fontSizeLG,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: isDark 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      : 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    color: isDark ? '#ffd700' : '#fff',
    border: 'none',
  };

  const notificationStyle: React.CSSProperties = {
    width: token.controlHeight,
    height: token.controlHeight,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: token.fontSizeLG,
    cursor: 'pointer',
    background: token.colorBgTextHover,
    color: token.colorTextSecondary,
    border: 'none',
  };

  const headerAvatarStyle: React.CSSProperties = {
    width: token.controlHeight,
    height: token.controlHeight,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColorSecondary} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: token.colorWhite,
    fontSize: token.fontSizeSM,
    fontWeight: fontWeights.bold,
    cursor: 'pointer',
    border: `2px solid ${token.colorBgContainer}`,
    boxShadow: `0 0 0 2px ${accentColor}40`,
  };

  // Main - background changes in learner mode
  const getMainBackground = () => {
    if (fullWidth) {
      if (isLearnerMode) {
        return isDark 
          ? 'linear-gradient(180deg, #2A1A1A 0%, #1A1625 50%, #0f0f14 100%)' // Dark coral to plum
          : 'linear-gradient(180deg, #FFF5F5 0%, #FFF0F0 50%, #FFEBEB 100%)'; // Soft blush gradient
      }
      return isDark 
        ? 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)' // Deep navy gradient
        : 'linear-gradient(180deg, #f8f9fc 0%, #eef1f8 100%)'; // Soft blue-gray gradient
    }
    // Non-fullWidth pages
    if (isLearnerMode) {
      return isDark ? '#1F1418' : '#FFF5F5';
    }
    return token.colorBgLayout;
  };

  const mainStyle: React.CSSProperties = {
    marginLeft: isMobile ? 0 : SIDEBAR_WIDTH,
    marginTop: HEADER_HEIGHT,
    ...(fullWidth ? {
      height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      overflow: 'hidden',
    } : {
    minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
    }),
    background: getMainBackground(),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // Mobile bottom nav height for padding (includes margin and safe area)
  const MOBILE_NAV_HEIGHT = 100;

  const contentStyle: React.CSSProperties = {
    ...(fullWidth ? { 
      padding: 0,
      height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      overflow: 'hidden',
    } : { 
      padding: isMobile ? token.paddingMD : token.paddingXL,
      paddingBottom: isMobile ? (hideMobileNav ? token.paddingMD : token.paddingMD + MOBILE_NAV_HEIGHT) : token.paddingXL,
      maxWidth: 1400,
      margin: '0 auto' 
    }),
  };

  const overlayStyle: React.CSSProperties = {
    display: isMobile && sidebarOpen ? 'block' : 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    // Overlay needs to be above bottom nav (token.zIndexPopupBase + 10) but below sidebar (token.zIndexPopupBase + 20)
    zIndex: token.zIndexPopupBase + 15,
  };

  // Nav item with tooltip wrapper
  const NavItemWithTooltip: React.FC<{ item: NavItem; isActive: boolean }> = ({ item, isActive }) => {
    const hoverBg = isLearnerMode ? 'rgba(255,255,255,0.2)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)');
    const hoverColor = isLearnerMode ? '#ffffff' : (isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)');
    const defaultColor = isLearnerMode ? 'rgba(255,255,255,0.85)' : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)');
    
    // Highlighted item (Tuition Center) has special styling - FULL WIDTH (edge to edge)
    // Applies both when active and inactive
    if (item.highlighted) {
      // Learner mode sidebar is coral (#FF6B6B), so use contrasting teal/cyan
      // Investor mode sidebar is white (light) or dark gray (dark), so use purple
      const highlightTextColor = isLearnerMode 
        ? '#FFFFFF'  // White text
        : (isDark ? '#C4B5FD' : '#7C3AED'); // Purple for investor mode
      const highlightBg = isLearnerMode
        ? 'linear-gradient(135deg, rgba(78, 205, 196, 0.3) 0%, rgba(69, 183, 209, 0.25) 100%)' // Teal - contrasts with coral
        : (isDark 
            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.06) 100%)');
      // Stronger background when active
      const activeBgColors = isLearnerMode
        ? ['rgba(78, 205, 196, 0.35)', 'rgba(78, 205, 196, 0.5)', 'rgba(78, 205, 196, 0.35)']
        : ['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.25)', 'rgba(139, 92, 246, 0.15)'];
      const inactiveBgColors = isLearnerMode
        ? ['rgba(78, 205, 196, 0.2)', 'rgba(78, 205, 196, 0.35)', 'rgba(78, 205, 196, 0.2)']
        : ['rgba(139, 92, 246, 0.08)', 'rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.08)'];
      
      // Calculate negative margin to counteract parent padding for full width
      const parentPaddingH = sidebarCollapsed && !isMobile ? token.paddingXS : token.paddingMD;
      
      const highlightedContent = (
        <motion.div
          animate={{
            backgroundColor: isActive ? activeBgColors : inactiveBgColors,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: token.marginSM,
            // Negative margin to break out of parent padding, padding inside to keep content aligned
            marginLeft: -parentPaddingH,
            marginRight: -parentPaddingH,
            padding: sidebarCollapsed && !isMobile 
              ? `${token.paddingSM}px ${token.paddingXS + token.paddingSM}px`
              : `${token.paddingSM}px ${token.paddingMD * 2}px`,
            borderRadius: 0, // No rounded corners - full width edge to edge
            background: highlightBg,
            fontSize: token.fontSize,
            fontWeight: fontWeights.semibold,
            cursor: 'pointer',
            justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={() => handleNavClick(item.href)}
        >
          {/* Shimmer effect */}
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 2,
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
          <div 
            style={{ 
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: token.fontSizeLG,
              color: highlightTextColor,
              flexShrink: 0,
              position: 'relative', 
              zIndex: 1,
            }}
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              {item.icon}
            </motion.span>
          </div>
          {!(sidebarCollapsed && !isMobile) && (
            <span 
              style={{ 
                color: highlightTextColor,
                whiteSpace: 'nowrap',
                position: 'relative', 
                zIndex: 1,
              }}
            >
              {item.label}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ marginLeft: 6, display: 'inline-block' }}
              >
                ✨
              </motion.span>
            </span>
          )}
        </motion.div>
      );

      if (sidebarCollapsed && !isMobile) {
        return (
          <Tooltip title={`${item.label} ✨`} placement="right">
            {highlightedContent}
          </Tooltip>
        );
      }

      return highlightedContent;
    }
    
    const content = (
      <div
        style={getNavItemStyle(item, isActive)}
        onClick={() => handleNavClick(item.href)}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = hoverBg;
            e.currentTarget.style.color = hoverColor;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = defaultColor;
          }
        }}
      >
        <div style={navIconContainerStyle(item, isActive)}>
          {item.icon}
        </div>
        <span style={navLabelStyle}>{item.label}</span>
      </div>
    );

    if (sidebarCollapsed && !isMobile) {
      return (
        <Tooltip title={item.label} placement="right">
          {content}
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <div>
      <div style={overlayStyle} onClick={() => setSidebarOpen(false)} />

      {/* Collapse toggle button (desktop only) - outside sidebar to avoid clipping */}
      {!isMobile && mounted && (
        <div
          style={collapseButtonStyle}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = token.colorPrimary;
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDark ? token.colorBgContainer : '#fff';
            e.currentTarget.style.color = token.colorTextSecondary;
          }}
        >
          {sidebarCollapsed ? <RightOutlined /> : <LeftOutlined />}
        </div>
      )}

      {/* Sidebar */}
      <aside style={sidebarStyle}>

        <div style={logoContainerStyle}>
          <Link href="/overview" style={logoStyle}>
            <Image
              src="/images/intuition-logo-no-text.svg"
              alt="InTuition"
              width={token.controlHeight}
              height={token.controlHeight}
            />
            <span style={logoTextStyle}>InTuition</span>
          </Link>
          {isMobile && (
            <CloseOutlined
              style={{ fontSize: token.fontSizeLG, color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)', cursor: 'pointer' }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>

        {/* Divider after logo */}
        <div style={dividerStyle} />

        <div style={navSectionStyle}>
          {navItems.map((item) => (
            <NavItemWithTooltip key={item.key} item={item} isActive={activeKey === item.key} />
          ))}
        </div>

        {/* Divider before bottom section */}
        <div style={dividerStyle} />

        <div style={bottomSectionStyle}>
          {/* Settings */}
          {(() => {
            const isSettingsActive = activeKey === 'settings';
            const settingsHoverBg = isLearnerMode ? 'rgba(255,255,255,0.2)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)');
            const settingsHoverColor = isLearnerMode ? '#ffffff' : (isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)');
            const settingsDefaultColor = isLearnerMode ? 'rgba(255,255,255,0.85)' : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)');
            
            const settingsContent = (
              <div
                style={getNavItemStyle({ key: 'settings', label: 'Settings', icon: <SettingOutlined />, href: '/settings', gradient: '' }, isSettingsActive)}
                onClick={() => handleNavClick('/settings')}
                onMouseEnter={(e) => {
                  if (!isSettingsActive) {
                    e.currentTarget.style.background = settingsHoverBg;
                    e.currentTarget.style.color = settingsHoverColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSettingsActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = settingsDefaultColor;
                  }
                }}
              >
                <div style={navIconContainerStyle({ gradient: '' } as NavItem, isSettingsActive)}>
                  <SettingOutlined />
                </div>
                {!(sidebarCollapsed && !isMobile) && <span style={navLabelStyle}>Settings</span>}
              </div>
            );

            if (sidebarCollapsed && !isMobile) {
              return (
                <Tooltip title="Settings" placement="right">
                  {settingsContent}
                </Tooltip>
              );
            }
            return settingsContent;
          })()}

          {/* User card */}
          {(() => {
            // Get full name or fallback to email username
            const fullName = user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user?.firstName || user?.email?.split('@')[0] || 'User';
            const avatarInitial = user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';
            
            return sidebarCollapsed && !isMobile ? (
              <Tooltip title={fullName} placement="right">
                <div style={{ ...userCardStyle, marginTop: token.marginMD }}>
                  <div style={userAvatarStyle}>
                    {avatarInitial}
                  </div>
                </div>
              </Tooltip>
            ) : (
              <div style={{ ...userCardStyle, marginTop: token.marginMD }}>
                <div style={userAvatarStyle}>
                  {avatarInitial}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: token.fontSize, fontWeight: fontWeights.semibold, color: isLearnerMode ? '#ffffff' : (isDark ? '#ffffff' : '#111827'), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {fullName}
                  </div>
                  <div style={{ fontSize: token.fontSizeSM, color: isLearnerMode ? 'rgba(255,255,255,0.7)' : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)') }}>
                    {user?.kycStatus === 'APPROVED' ? '✓ Verified' : 'Unverified'}
                  </div>
                </div>
                <PoweroffOutlined
                  style={{ fontSize: token.fontSizeLG, color: isLearnerMode ? 'rgba(255,255,255,0.7)' : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'), cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                />
              </div>
            );
          })()}
        </div>
      </aside>

      {/* Header */}
      <header style={headerStyle}>
        <div style={headerLeftStyle}>
          {isMobile && (
            <>
              <MenuOutlined
                style={{ fontSize: token.fontSizeLG, color: token.colorText, cursor: 'pointer' }}
                onClick={() => setSidebarOpen(true)}
              />
              <Image
                src="/images/intuition-logo-no-text.svg"
                alt="InTuition"
                width={token.controlHeight}
                height={token.controlHeight}
              />
            </>
          )}
          {!isMobile && (
            <>
              {exchangeData ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: token.marginMD }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
                    {exchangeData.iconUrl && (
                      <img
                        src={exchangeData.iconUrl}
                        alt={exchangeData.baseAsset || exchangeData.pair.split('-')[0]}
                        width={32}
                        height={32}
                        style={{ borderRadius: '50%' }}
                        onError={(e) => { 
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${exchangeData.baseAsset || exchangeData.pair.split('-')[0]}&background=799EFF&color=fff`; 
                        }}
                      />
                    )}
                    <span style={{ fontSize: token.fontSizeLG, fontWeight: fontWeights.bold, color: token.colorText }}>
                      {exchangeData.pair}
                    </span>
                    <span style={{ fontSize: token.fontSizeHeading4, fontWeight: fontWeights.bold, color: token.colorText }}>
                      ${exchangeData.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </span>
                    <span style={{ 
                      fontSize: token.fontSizeLG, 
                      fontWeight: fontWeights.bold,
                      color: exchangeData.change >= 0 ? '#52c41a' : '#ff4d4f',
                      padding: `${token.paddingXXS}px ${token.paddingXS}px`,
                      borderRadius: token.borderRadiusSM,
                      backgroundColor: exchangeData.change >= 0 
                        ? 'rgba(82, 196, 26, 0.1)' 
                        : 'rgba(255, 77, 79, 0.1)',
                    }}>
                      {exchangeData.change >= 0 ? '+' : ''}{exchangeData.change.toFixed(2)}%
                    </span>
                    {exchangeData.volume && (
                      <span style={{ 
                        fontSize: token.fontSize,
                        color: token.colorTextSecondary,
                        fontWeight: fontWeights.medium,
                      }}>
                        24h Vol: {exchangeData.volume}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
            mounted && screens.xl && (
              <div style={welcomeStyle}>
                <span style={welcomeTextStyle}>{greeting}</span>
                <span style={userNameStyle}>{user?.firstName || user?.email?.split('@')[0] || 'User'} 👋</span>
              </div>
            )
              )}
            </>
          )}
          
          {/* Learner Mode Badge with Tooltip */}
          {mounted && isLearnerMode && (
            <Tooltip
              title={
                <div style={{ padding: '4px 0' }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>🎓 Learner Mode Active</div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>
                    You're trading with $10,000 virtual balance.
                    <br />
                    No real money is involved.
                    <br /><br />
                    Switch to Investor mode in Settings when you're ready for real trading.
                  </div>
                </div>
              }
              placement="bottom"
              color="#FF6B6B"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: isMobile ? 4 : token.marginXS,
                  height: token.controlHeight,
                  background: 'linear-gradient(135deg, #D94848 0%, #FF6B6B 50%, #FF8E8E 100%)',
                  borderRadius: 50,
                  padding: isMobile ? '0 10px' : `0 ${token.paddingMD}px`,
                  marginLeft: isMobile ? 0 : token.marginMD,
                  boxShadow: '0 4px 16px rgba(255, 107, 107, 0.4)',
                  animation: 'pulse-learner 2s ease-in-out infinite',
                  cursor: 'help',
                }}
              >
                <span style={{ fontSize: isMobile ? 12 : 14, lineHeight: 1 }}>🎓</span>
                <span
                  style={{
                    fontSize: isMobile ? 10 : token.fontSizeSM,
                    fontWeight: fontWeights.bold,
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    lineHeight: 1,
                  }}
                >
                  Learner
                </span>
              </div>
            </Tooltip>
          )}
        </div>

        <div style={headerRightStyle}>
          {/* Search Field */}
          {mounted && screens.xl && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: token.marginSM,
              backgroundColor: isLearnerMode 
                ? (isDark ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 107, 107, 0.1)')
                : (isDark ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.08)'),
              borderRadius: 50,
              padding: `${token.paddingSM}px ${token.paddingLG}px`,
              marginRight: token.marginMD,
            }}>
              <SearchOutlined style={{ 
                color: accentColor, 
                fontSize: token.fontSize,
              }} />
              <input
                type="text"
                placeholder="Search markets, assets..."
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: token.colorText,
                  fontSize: token.fontSize,
                  width: 200,
                  padding: 0,
                }}
              />
            </div>
          )}

          {!isMobile && (
            <div
              onClick={() => router.push('/portfolio?action=deposit')}
              style={{
                cursor: 'pointer',
                fontWeight: fontWeights.semibold,
                fontSize: token.fontSize,
                color: accentColor,
                marginRight: token.marginMD,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              Deposit
            </div>
          )}

          <div style={themeButtonStyle} onClick={toggleMode}>
            {isDark ? <MoonOutlined /> : <SunOutlined />}
          </div>

          <div style={notificationStyle}>
            <Badge count={0} size="small">
              <BellOutlined style={{ fontSize: token.fontSizeLG, color: token.colorTextSecondary }} />
            </Badge>
          </div>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <div style={headerAvatarStyle}>
              {user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </Dropdown>
        </div>
      </header>

      {/* Main */}
      <main style={mainStyle}>
        {/* KYC Banner - Show when user is not verified */}
        {mounted && user && user.kycStatus !== 'APPROVED' && !kycBannerDismissed && (
          <div
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#ffffff',
              padding: `${token.paddingSM}px ${token.paddingLG}px`,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'space-between',
              gap: isMobile ? token.marginSM : token.marginMD,
              position: 'relative',
            }}
          >
            {/* Close button - positioned top right on mobile only */}
            {isMobile && (
              <CloseOutlined 
                style={{ 
                  position: 'absolute',
                  top: token.paddingSM,
                  right: token.paddingSM,
                  fontSize: 14, 
                  color: 'rgba(255,255,255,0.8)', 
                  cursor: 'pointer',
                  padding: 4,
                }}
                onClick={() => {
                  setKycBannerDismissed(true);
                  sessionStorage.setItem('kycBannerDismissed', 'true');
                }}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM, flex: 1, paddingRight: isMobile ? 24 : 0 }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <span style={{ fontWeight: fontWeights.medium, fontSize: token.fontSize }}>
                {user.kycStatus === 'SUBMITTED'
                  ? 'Your identity verification is in progress.'
                  : 'Complete identity verification to unlock real trading and deposits.'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM, justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
              {user.kycStatus !== 'SUBMITTED' && (
                <>
                  <Button
                    size="small"
                    onClick={() => router.push('/tuition-center')}
                    style={{
                      background: 'transparent',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.5)',
                      fontWeight: fontWeights.medium,
                    }}
                  >
                    Practice KYC
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => router.push('/onboarding')}
                    style={{
                      background: '#fff',
                      color: '#DC2626',
                      border: 'none',
                      fontWeight: fontWeights.semibold,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    Complete Verification
                  </Button>
                </>
              )}
              {/* Close button - inline on desktop */}
              {!isMobile && (
                <CloseOutlined 
                  style={{ 
                    fontSize: 14, 
                    color: 'rgba(255,255,255,0.8)', 
                    cursor: 'pointer',
                    padding: 4,
                    marginLeft: token.marginXS,
                  }}
                  onClick={() => {
                  setKycBannerDismissed(true);
                  sessionStorage.setItem('kycBannerDismissed', 'true');
                }}
                />
              )}
            </div>
          </div>
        )}
        <div style={contentStyle}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - hidden on certain pages like trade */}
      {!hideMobileNav && <MobileBottomNav />}
    </div>
  );
};

export default DashboardLayout;
