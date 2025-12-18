'use client';

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { theme, Grid } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { fontWeights } from '@/theme/themeConfig';
import { useThemeMode } from '@/context/ThemeContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

// Professional indigo/purple theme colors
const themeColors = {
  primary: '#6366F1',
  light: '#A5B4FC',
  dark: '#4338CA',
  accent: '#818CF8',
};

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps = 4,
  title,
  subtitle,
  showBack = false,
  onBack,
}) => {
  const { token } = useToken();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const router = useRouter();
  const isDark = mode === 'dark';
  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  // Get background gradient based on theme
  const getBackground = () => {
    if (isDark) {
      return `linear-gradient(160deg, #0f0a1e 0%, #1a1033 30%, #0f0a1e 60%, #1a0a2e 100%)`;
    }
    return `linear-gradient(160deg, ${themeColors.primary} 0%, ${themeColors.dark} 40%, #312E81 100%)`;
  };

  // Container
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: getBackground(),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  // Header
  const headerStyle: React.CSSProperties = {
    padding: `${token.paddingMD}px ${token.paddingLG}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid rgba(255,255,255,0.1)`,
    width: '100%',
    maxWidth: 520,
  };

  // Main content
  const mainStyle: React.CSSProperties = {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    display: 'flex',
    flexDirection: 'column',
    padding: isMobile ? `${token.paddingMD}px` : `${token.paddingLG}px`,
    paddingBottom: isMobile ? token.paddingXL * 2 : token.paddingXL,
  };

  // Title area
  const titleContainerStyle: React.CSSProperties = {
    marginBottom: isMobile ? token.marginMD : token.marginLG,
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? 22 : 28,
    fontWeight: fontWeights.bold,
    color: '#ffffff',
    marginBottom: token.marginXS,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: isMobile ? token.fontSize : token.fontSizeLG,
    color: 'rgba(255,255,255,0.8)',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    lineHeight: 1.5,
  };

  // Content area
  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
          {showBack && onBack ? (
            <div
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: token.marginXS,
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                fontSize: token.fontSize,
              }}
            >
              <ArrowLeftOutlined />
              {!isMobile && <span>Back</span>}
            </div>
          ) : (
            <Link href="/overview" style={{ display: 'flex', alignItems: 'center', gap: token.marginXS, textDecoration: 'none' }}>
              <Image
                src="/images/intuition-logo-no-text.svg"
                alt="InTuition"
                width={32}
                height={32}
              />
              {!isMobile && (
                <span style={{ 
                  fontSize: token.fontSizeLG, 
                  fontWeight: fontWeights.bold, 
                  color: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}>
                  InTuition
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
          <span style={{
            fontSize: token.fontSizeSM,
            color: 'rgba(255,255,255,0.7)',
          }}>
            {currentStep + 1} / {totalSteps + 1}
          </span>
          <div style={{
            width: isMobile ? 80 : 120,
            height: 8,
            background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: isDark
                  ? `linear-gradient(90deg, ${themeColors.accent} 0%, ${themeColors.light} 100%)`
                  : `linear-gradient(90deg, #FFE066 0%, #FFC107 100%)`,
                borderRadius: 4,
                boxShadow: isDark
                  ? `0 0 8px ${themeColors.accent}80`
                  : '0 0 8px rgba(255,224,102,0.6)',
              }}
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={mainStyle}>
        {/* Title & Subtitle */}
        {(title || subtitle) && (
          <div style={titleContainerStyle}>
            {title && <h1 style={titleStyle}>{title}</h1>}
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          </div>
        )}

        {/* Content */}
        <div style={contentStyle}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
