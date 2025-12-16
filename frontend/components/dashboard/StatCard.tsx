'use client';

import React, { useState, useEffect } from 'react';
import { theme, Grid } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fontWeights } from '@/theme/themeConfig';

const { useToken } = theme;
const { useBreakpoint } = Grid;

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  gradient?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onDepositClick?: () => void;
  showDepositButton?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  gradient,
  trend,
  onDepositClick,
  showDepositButton = false,
}) => {
  const { token } = useToken();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const bgColor = color || token.colorPrimary;

  // Wait for client-side mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Responsive font size calculations
  const isMobile = mounted ? !screens.md : false;
  const isTablet = mounted ? (screens.md && !screens.xl) : false;
  
  // Font size adjustments (subtle)
  const titleFontSize = isMobile 
    ? token.fontSizeSM * 0.9  // 10.8px (from 12px)
    : isTablet 
    ? token.fontSizeSM * 0.95  // 11.4px
    : token.fontSizeSM;        // 12px

  const valueFontSize = isMobile
    ? token.fontSizeHeading1 * 0.75  // 36px (from 48px)
    : isTablet
    ? token.fontSizeHeading1 * 0.85  // 40.8px
    : token.fontSizeHeading1;       // 48px

  const subtitleFontSize = isMobile
    ? token.fontSize * 0.9  // 12.6px (from 14px)
    : isTablet
    ? token.fontSize * 0.95  // 13.3px
    : token.fontSize;        // 14px

  const iconFontSize = isMobile
    ? token.fontSizeHeading3 * 0.85  // 20.4px (from 24px)
    : isTablet
    ? token.fontSizeHeading3 * 0.9  // 21.6px
    : token.fontSizeHeading3;        // 24px
  
  // Default gradient for total balance card
  const defaultGradient = gradient || `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`;
  
  // For other cards, use color-based gradient if no gradient provided
  const cardGradient = gradient || (color 
    ? `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`
    : defaultGradient);

  const cardStyle: React.CSSProperties = {
    background: cardGradient,
    borderRadius: token.borderRadiusLG,
    padding: token.paddingXL,
    color: token.colorWhite,
    display: 'flex',
    flexDirection: 'column',
    gap: token.marginMD,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    minHeight: '160px',
    flex: 1,
    boxShadow: `0 8px 24px ${bgColor}40`,
  };

  // Decorative background elements
  const decorativeCircle1: React.CSSProperties = {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    filter: 'blur(20px)',
  };

  const decorativeCircle2: React.CSSProperties = {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
    filter: 'blur(15px)',
  };

  const iconContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: token.paddingLG,
    right: token.paddingLG,
    width: isMobile ? 56 : isTablet ? 60 : 64,
    height: isMobile ? 56 : isTablet ? 60 : 64,
    borderRadius: token.borderRadiusLG,
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: iconFontSize,
    opacity: 0.9,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: token.marginXS,
    flex: 1,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: titleFontSize,
    fontWeight: fontWeights.medium,
    opacity: 0.95,
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: valueFontSize,
    fontWeight: fontWeights.bold,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: subtitleFontSize,
    opacity: 0.9,
    lineHeight: 1.4,
    marginTop: token.marginXXS,
  };

  const trendStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    fontWeight: fontWeights.semibold,
    display: 'flex',
    alignItems: 'center',
    gap: token.marginXS,
    marginTop: token.marginXS,
    opacity: 0.95,
  };

  const depositButtonStyle: React.CSSProperties = {
    marginTop: token.marginSM,
    padding: `${token.paddingSM}px ${token.paddingMD}px`,
    borderRadius: token.borderRadiusLG,
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: token.colorWhite,
    fontSize: token.fontSizeSM,
    fontWeight: fontWeights.semibold,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: token.marginXS,
    transition: 'all 0.2s ease',
    width: 'fit-content',
  };

  return (
    <div style={cardStyle}>
      {/* Decorative background circles */}
      <div style={decorativeCircle1} />
      <div style={decorativeCircle2} />
      
      {/* Icon */}
      {icon && (
        <div style={iconContainerStyle}>
          {icon}
        </div>
      )}
      
      {/* Content */}
      <div style={contentStyle}>
        <div style={titleStyle}>{title}</div>
        <div style={valueStyle}>{value}</div>
        {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
        {trend && (
          <div style={trendStyle}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
            <span style={{ opacity: 0.8, fontSize: token.fontSizeSM }}>vs last week</span>
          </div>
        )}
        {showDepositButton && onDepositClick && (
          <button
            onClick={onDepositClick}
            style={depositButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <PlusOutlined />
            <span>Deposit Cash</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StatCard;
