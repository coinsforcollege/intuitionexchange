'use client';

import React from 'react';
import { theme } from 'antd';
import { fontWeights } from '@/theme/themeConfig';

const { useToken } = theme;

interface AssetCardProps {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

const AssetCard: React.FC<AssetCardProps> = ({
  symbol,
  name,
  balance,
  value,
  change,
  icon,
  color,
  onClick,
}) => {
  const { token } = useToken();
  const accentColor = color || token.colorPrimary;

  const cardStyle: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    padding: token.paddingMD,
    display: 'flex',
    alignItems: 'center',
    gap: token.marginMD,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'background-color 0.2s ease',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: token.controlHeightLG,
    height: token.controlHeightLG,
    borderRadius: '50%',
    backgroundColor: accentColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: token.colorWhite,
    fontSize: token.fontSizeLG,
    fontWeight: fontWeights.bold,
    flexShrink: 0,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'hidden',
  };

  const symbolStyle: React.CSSProperties = {
    fontSize: token.fontSizeLG,
    fontWeight: fontWeights.semibold,
    color: token.colorText,
  };

  const nameStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    color: token.colorTextSecondary,
  };

  const valueContainerStyle: React.CSSProperties = {
    textAlign: 'right' as const,
  };

  const balanceStyle: React.CSSProperties = {
    fontSize: token.fontSizeLG,
    fontWeight: fontWeights.semibold,
    color: token.colorText,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    color: token.colorTextSecondary,
  };

  const changeStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    fontWeight: fontWeights.medium,
    color: change && change >= 0 ? token.colorSuccess : token.colorError,
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = token.colorBgTextHover;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = token.colorBgContainer;
      }}
    >
      <div style={iconContainerStyle}>
        {icon || symbol.charAt(0)}
      </div>
      <div style={contentStyle}>
        <div style={symbolStyle}>{symbol}</div>
        <div style={nameStyle}>{name}</div>
      </div>
      <div style={valueContainerStyle}>
        <div style={balanceStyle}>{balance}</div>
        <div style={valueStyle}>{value}</div>
        {change !== undefined && (
          <div style={changeStyle}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;

