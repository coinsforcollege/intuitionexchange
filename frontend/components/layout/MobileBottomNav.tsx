'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { theme, Grid } from 'antd';
import { motion, LayoutGroup } from 'motion/react';
import { useThemeMode } from '@/context/ThemeContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

interface NavItem {
  key: string;
  label: string;
  href: string;
}

// Icon components
const OverviewIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const BuySellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" fill="currentColor" />
    <circle cx="20" cy="21" r="1" fill="currentColor" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const TradeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const PortfolioIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
  </svg>
);

const MarketsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </svg>
);

const ICONS: Record<string, React.ReactNode> = {
  'overview': <OverviewIcon />,
  'buy-sell': <BuySellIcon />,
  'trade': <TradeIcon />,
  'portfolio': <PortfolioIcon />,
  'markets': <MarketsIcon />,
};

const MobileBottomNav: React.FC = () => {
  const router = useRouter();
  const { token } = useToken();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [appMode, setAppMode] = useState<'learner' | 'investor'>('investor');
  const [activeKey, setActiveKey] = useState(() => {
    // Initialize from current path on mount
    if (typeof window === 'undefined') return 'overview';
    const path = window.location.pathname;
    if (path.startsWith('/overview')) return 'overview';
    if (path.startsWith('/buy-sell')) return 'buy-sell';
    if (path.startsWith('/trade')) return 'trade';
    if (path.startsWith('/portfolio')) return 'portfolio';
    if (path.startsWith('/markets')) return 'markets';
    return 'overview';
  });

  const isDark = mode === 'dark';
  const isMobile = mounted ? !screens.md : false;
  const isLearnerMode = appMode === 'learner';

  const navItems: NavItem[] = useMemo(() => [
    { key: 'overview', label: 'Overview', href: '/overview' },
    { key: 'buy-sell', label: 'Buy & Sell', href: '/buy-sell' },
    { key: 'trade', label: 'Trade', href: '/trade' },
    { key: 'portfolio', label: 'Portfolio', href: '/portfolio' },
    { key: 'markets', label: 'Markets', href: '/markets' },
  ], []);

  useEffect(() => {
    setMounted(true);
    
    // Load app mode from localStorage
    const savedMode = localStorage.getItem('appMode') as 'learner' | 'investor' | null;
    if (savedMode) {
      setAppMode(savedMode);
    }

    // Poll for changes (for same-tab updates from settings)
    const interval = setInterval(() => {
      const currentMode = localStorage.getItem('appMode') as 'learner' | 'investor' | null;
      if (currentMode && currentMode !== appMode) {
        setAppMode(currentMode);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [appMode]);

  // Handle nav click - update state IMMEDIATELY, then navigate
  // This decouples the animation from page load
  const handleNavClick = useCallback((item: NavItem) => {
    // Optimistically update active state for instant animation
    setActiveKey(item.key);
    
    // Use startTransition to deprioritize the navigation
    // This lets the animation complete before heavy page render
    React.startTransition(() => {
      router.push(item.href);
    });
  }, [router]);

  if (!mounted || !isMobile) {
    return null;
  }

  const NAV_HEIGHT = 72;
  const NAV_MARGIN = 16;
  const BUBBLE_SIZE = 50;

  // Colors change based on app mode - Learner mode uses coral palette, Investor uses indigo
  const primaryColor = isLearnerMode ? '#FF6B6B' : '#6366F1';
  const secondaryColor = isLearnerMode ? '#FF8E8E' : '#8B5CF6';
  // Gradient background for both modes
  const bgColor = isLearnerMode 
    ? (isDark 
        ? 'linear-gradient(135deg, rgba(74, 28, 28, 0.9) 0%, rgba(60, 20, 20, 0.9) 100%)'
        : 'linear-gradient(135deg, #D94848 0%, #FF6B6B 50%, #FF8E8E 100%)')
    : (isDark
        ? 'linear-gradient(135deg, rgba(49, 46, 129, 0.9) 0%, rgba(79, 70, 229, 0.85) 100%)'
        : '#4F46E5');
  const inactiveColor = 'rgba(255, 255, 255, 0.6)';
  const activeIconColor = '#FFFFFF';
  // Page base color for bubble stroke - matches theme
  // Dark: custom colorBgBase, Light: Ant Design default colorBgLayout
  const pageBaseColor = isDark 
    ? (isLearnerMode ? '#1F1418' : '#0f0f1a') 
    : (isLearnerMode ? '#FFF5F5' : '#f5f5f5');

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: token.zIndexPopupBase + 10,
          paddingBottom: 'env(safe-area-inset-bottom, 0)',
        }}
      >
        <div
          style={{
            position: 'relative',
            margin: `0 ${NAV_MARGIN}px ${NAV_MARGIN}px`,
          }}
        >
          <div
            style={{
              position: 'relative',
              height: NAV_HEIGHT,
              borderRadius: 36,
              background: bgColor,
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              boxShadow: isLearnerMode
                ? (isDark 
                    ? '0 8px 40px rgba(255, 107, 107, 0.3)' 
                    : '0 8px 40px rgba(255, 107, 107, 0.25)')
                : (isDark
                    ? '0 8px 40px rgba(99, 102, 241, 0.35)'
                    : '0 8px 40px rgba(0, 0, 0, 0.12)'),
              border: isLearnerMode
                ? (isDark 
                    ? '1px solid rgba(255, 107, 107, 0.3)' 
                    : '1px solid rgba(255, 255, 255, 0.4)')
                : (isDark
                    ? '1px solid rgba(99, 102, 241, 0.4)'
                    : '1px solid rgba(0, 0, 0, 0.04)'),
              overflow: 'visible',
            }}
          >
            <LayoutGroup>
              <ul
                style={{
                  display: 'flex',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  height: '100%',
                }}
              >
                {navItems.map((item) => {
                  const isActive = activeKey === item.key;

                  return (
                    <li
                      key={item.key}
                      onClick={() => handleNavClick(item)}
                      style={{
                        flex: 1,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingBottom: 8,
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      {/* Floating bubble background - moves via layoutId */}
                      {isActive && (
                        <motion.div
                          layoutId="activeBubble"
                          style={{
                            position: 'absolute',
                            top: -BUBBLE_SIZE / 2 + 6,
                            width: BUBBLE_SIZE,
                            height: BUBBLE_SIZE,
                            borderRadius: BUBBLE_SIZE / 2,
                            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                            boxShadow: `0 6px 20px ${primaryColor}50`,
                            border: `5px solid ${pageBaseColor}`,
                            willChange: 'transform',
                            transform: 'translateZ(0)',
                          }}
                          transition={{
                            type: 'spring',
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}

                      {/* Icon container - fixed position, color changes */}
                      <div
                        style={{
                          position: 'absolute',
                          top: isActive ? -BUBBLE_SIZE / 2 + 6 + (BUBBLE_SIZE - 22) / 2 : 12,
                          width: 22,
                          height: 22,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isActive ? activeIconColor : inactiveColor,
                          zIndex: 1,
                          transition: 'top 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease',
                        }}
                      >
                        {ICONS[item.key]}
                      </div>

                      {/* Label */}
                      <span
                        style={{
                          fontSize: 10,
                          color: isActive ? activeIconColor : inactiveColor,
                          fontWeight: isActive ? 600 : 500,
                          transition: 'color 0.2s ease',
                          marginTop: 26,
                        }}
                      >
                        {item.label}
                      </span>

                      {/* Active dot */}
                      {isActive && (
                        <motion.div
                          layoutId="activeDot"
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: 2.5,
                            background: activeIconColor,
                            marginTop: 3,
                          }}
                          transition={{
                            type: 'spring',
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </div>
        </div>
      </nav>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'env(safe-area-inset-bottom, 0)',
          background: bgColor,
          zIndex: token.zIndexPopupBase + 9,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export default MobileBottomNav;
