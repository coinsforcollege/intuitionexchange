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
} from '@ant-design/icons';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

const { useToken } = theme;
const { useBreakpoint } = Grid;

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeKey?: string;
  fullWidth?: boolean;
  exchangeData?: {
    pair: string;
    price: number;
    change: number;
    volume?: string;
    iconUrl?: string;
    baseAsset?: string;
  };
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeKey = 'dashboard',
  fullWidth = false,
  exchangeData,
}) => {
  const router = useRouter();
  const { token } = useToken();
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [greeting, setGreeting] = useState('Welcome');

  // Wait for client-side mount to avoid hydration mismatch with useBreakpoint
  const isMobile = mounted ? !screens.md : false;

  const isDark = mode === 'dark';

  // Set mounted and greeting on client side only to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Dimensions
  const SIDEBAR_WIDTH_EXPANDED = token.sizeXXL * 6; // 288px
  const SIDEBAR_WIDTH_COLLAPSED = 72; // Icons only
  const SIDEBAR_WIDTH = sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
  const HEADER_HEIGHT = token.controlHeightLG * 1.5;

  // Gradients for nav items - sequence: Overview, Trade, Buy & Sell, P2P, Markets, Portfolio, Transactions
  const navItems: NavItem[] = [
    { 
      key: 'overview', 
      label: 'Overview', 
      icon: <AppstoreOutlined />, 
      href: '/overview',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    { 
      key: 'trade', 
      label: 'Trade', 
      icon: <SwapOutlined />, 
      href: '/trade',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    { 
      key: 'buy-sell', 
      label: 'Buy & Sell', 
      icon: <ShoppingCartOutlined />, 
      href: '/buy-sell',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    },
    { 
      key: 'p2p', 
      label: 'P2P', 
      icon: <TeamOutlined />, 
      href: '/p2p',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    { 
      key: 'markets', 
      label: 'Markets', 
      icon: <LineChartOutlined />, 
      href: '/markets',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    { 
      key: 'portfolio', 
      label: 'Portfolio', 
      icon: <WalletOutlined />, 
      href: '/portfolio',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
    { 
      key: 'transactions', 
      label: 'Transactions', 
      icon: <HistoryOutlined />, 
      href: '/transactions',
      gradient: 'linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%)',
    },
  ];

  const handleNavClick = (href: string) => {
    router.push(href);
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'email',
      label: (
        <div>
          <div style={{ fontWeight: fontWeights.semibold, color: token.colorText }}>
            {user?.email?.split('@')[0] || 'User'}
          </div>
          <div style={{ fontSize: token.fontSize, color: token.colorTextSecondary }}>
            {user?.kycStatus === 'APPROVED' ? '✓ Verified' : 'Complete verification'}
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined />, onClick: () => router.push('/settings') },
    { type: 'divider' },
    { key: 'logout', label: 'Log Out', icon: <PoweroffOutlined />, danger: true, onClick: handleLogout },
  ];

  // ============ STYLES ============

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: isMobile ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH,
    background: isDark 
      ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      : 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: token.zIndexPopupBase + 1,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    color: token.colorWhite,
    letterSpacing: '-0.01em',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
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

  const getNavItemStyle = (item: NavItem, isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: token.marginSM,
    padding: sidebarCollapsed && !isMobile 
      ? `${token.paddingSM}px`
      : `${token.paddingSM}px ${token.paddingMD}px`,
    borderRadius: token.borderRadius,
    background: isActive ? 'rgba(255,255,255,0.25)' : 'transparent',
    backdropFilter: isActive ? 'blur(10px)' : 'none',
    color: token.colorWhite,
    fontSize: token.fontSize,
    fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
  });

  const navIconContainerStyle = (item: NavItem, isActive: boolean): React.CSSProperties => ({
    width: token.controlHeightSM + 4,
    height: token.controlHeightSM + 4,
    borderRadius: token.borderRadiusSM,
    background: isActive ? item.gradient : item.gradient,
    opacity: isActive ? 1 : 0.6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: token.fontSize,
    color: token.colorWhite,
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
    borderRadius: token.borderRadius,
    background: 'rgba(255,255,255,0.1)',
    cursor: 'pointer',
    justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
  };

  const userAvatarStyle: React.CSSProperties = {
    width: token.controlHeightLG,
    height: token.controlHeightLG,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: token.colorWhite,
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
    background: isDark ? token.colorBgContainer : token.colorBgContainer,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${token.paddingLG}px`,
    zIndex: token.zIndexPopupBase,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
    width: token.controlHeightLG,
    height: token.controlHeightLG,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: token.colorWhite,
    fontSize: token.fontSize,
    fontWeight: fontWeights.bold,
    cursor: 'pointer',
    border: `2px solid ${token.colorBgContainer}`,
    boxShadow: `0 0 0 2px ${token.colorPrimary}40`,
  };

  // Main
  const mainStyle: React.CSSProperties = {
    marginLeft: isMobile ? 0 : SIDEBAR_WIDTH,
    marginTop: HEADER_HEIGHT,
    ...(fullWidth ? {
      height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      overflow: 'hidden',
    } : {
    minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
    }),
    background: fullWidth 
      ? (isDark 
          ? 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)' // Deep navy gradient
          : 'linear-gradient(180deg, #f8f9fc 0%, #eef1f8 100%)') // Soft blue-gray gradient
      : token.colorBgLayout,
    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
      paddingBottom: isMobile ? token.paddingMD + MOBILE_NAV_HEIGHT : token.paddingXL,
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
    zIndex: token.zIndexPopupBase,
  };

  // Nav item with tooltip wrapper
  const NavItemWithTooltip: React.FC<{ item: NavItem; isActive: boolean }> = ({ item, isActive }) => {
    const content = (
      <div
        style={getNavItemStyle(item, isActive)}
        onClick={() => handleNavClick(item.href)}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
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
              style={{ fontSize: token.fontSizeLG, color: token.colorWhite, cursor: 'pointer' }}
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
          {sidebarCollapsed && !isMobile ? (
            <Tooltip title="Settings" placement="right">
              <div
                style={getNavItemStyle({ key: 'settings', label: 'Settings', icon: <SettingOutlined />, href: '/settings', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }, activeKey === 'settings')}
                onClick={() => handleNavClick('/settings')}
              >
                <div style={navIconContainerStyle({ gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' } as NavItem, activeKey === 'settings')}>
                  <SettingOutlined />
                </div>
              </div>
            </Tooltip>
          ) : (
          <div
            style={getNavItemStyle({ key: 'settings', label: 'Settings', icon: <SettingOutlined />, href: '/settings', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }, activeKey === 'settings')}
            onClick={() => handleNavClick('/settings')}
          >
            <div style={navIconContainerStyle({ gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' } as NavItem, activeKey === 'settings')}>
              <SettingOutlined />
            </div>
              <span style={navLabelStyle}>Settings</span>
          </div>
          )}

          {/* User card */}
          {sidebarCollapsed && !isMobile ? (
            <Tooltip title={user?.email?.split('@')[0] || 'User'} placement="right">
              <div style={{ ...userCardStyle, marginTop: token.marginMD }}>
                <div style={userAvatarStyle}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            </Tooltip>
          ) : (
          <div style={{ ...userCardStyle, marginTop: token.marginMD }}>
            <div style={userAvatarStyle}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: token.fontSize, fontWeight: fontWeights.semibold, color: token.colorWhite, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email?.split('@')[0] || 'User'}
              </div>
              <div style={{ fontSize: token.fontSize, color: 'rgba(255,255,255,0.7)' }}>
                {user?.kycStatus === 'APPROVED' ? '✓ Verified' : 'Pending'}
              </div>
            </div>
            <PoweroffOutlined
              style={{ fontSize: token.fontSizeLG, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            />
          </div>
          )}
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
                <span style={userNameStyle}>{user?.email?.split('@')[0] || 'User'} 👋</span>
              </div>
            )
              )}
            </>
          )}
        </div>

        <div style={headerRightStyle}>
          {/* Search Field */}
          {mounted && screens.xl && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: token.marginSM,
              backgroundColor: isDark ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.08)',
              borderRadius: 50,
              padding: `${token.paddingSM}px ${token.paddingLG}px`,
              marginRight: token.marginMD,
            }}>
              <SearchOutlined style={{ 
                color: '#667eea', 
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
                color: '#667eea',
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
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </Dropdown>
        </div>
      </header>

      {/* Main */}
      <main style={mainStyle}>
        <div style={contentStyle}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default DashboardLayout;
