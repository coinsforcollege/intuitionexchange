'use client';

import React from 'react';
import { theme } from 'antd';
import { fontWeights } from '@/theme/themeConfig';

const { useToken } = theme;

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}) => {
  const { token } = useToken();
  const bgColor = color || token.colorPrimary;

  const cardStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    borderRadius: token.borderRadius,
    padding: token.paddingLG,
    color: token.colorWhite,
    display: 'flex',
    flexDirection: 'column',
    gap: token.marginSM,
    position: 'relative',
    overflow: 'hidden',
  };

  const iconContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: token.paddingMD,
    right: token.paddingMD,
    opacity: 0.3,
    fontSize: token.fontSizeHeading1,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    fontWeight: fontWeights.medium,
    opacity: 0.9,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading2,
    fontWeight: fontWeights.bold,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    opacity: 0.8,
  };

  const trendStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    fontWeight: fontWeights.medium,
    display: 'flex',
    alignItems: 'center',
    gap: token.marginXS,
  };

  return (
    <div style={cardStyle}>
      {icon && <div style={iconContainerStyle}>{icon}</div>}
      <div style={titleStyle}>{title}</div>
      <div style={valueStyle}>{value}</div>
      {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
      {trend && (
        <div style={trendStyle}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span style={{ opacity: 0.7 }}>vs last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

