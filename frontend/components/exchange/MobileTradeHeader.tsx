'use client';

import React from 'react';
import { useRouter } from 'next/router';
import { theme } from 'antd';
import { LeftOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { fontWeights } from '@/theme/themeConfig';
import { useThemeMode } from '@/context/ThemeContext';

const { useToken } = theme;

interface MobileTradeHeaderProps {
  pair: string;
  price: number;
  priceChange: number;
  iconUrl?: string;
  onPairClick: () => void;
}

const MobileTradeHeader: React.FC<MobileTradeHeaderProps> = ({
  pair,
  price,
  priceChange,
  iconUrl,
  onPairClick,
}) => {
  const router = useRouter();
  const { token } = useToken();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const [baseAsset] = pair.split('-');
  const isPositive = priceChange >= 0;

  const handleBack = () => {
    router.push('/overview');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: `${token.paddingXS}px ${token.paddingSM}px`,
        gap: token.marginSM,
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
        background: isDark 
          ? 'rgba(15, 15, 26, 0.95)'
          : 'rgba(255, 255, 255, 0.98)',
      }}
    >
      {/* Back Button */}
      <div
        onClick={handleBack}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <LeftOutlined style={{ fontSize: 14, color: token.colorText }} />
      </div>

      {/* Token Icon */}
      <img
        src={iconUrl || `https://assets.coincap.io/assets/icons/${baseAsset.toLowerCase()}@2x.png`}
        alt={baseAsset}
        width={28}
        height={28}
        style={{ borderRadius: '50%', flexShrink: 0 }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${baseAsset}&size=28&background=6366F1&color=ffffff`;
        }}
      />

      {/* Pair Name - Clickable Pill */}
      <div
        onClick={onPairClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 20,
          cursor: 'pointer',
          backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
          border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
          transition: 'all 0.2s ease',
        }}
      >
        <span
          style={{
            fontSize: token.fontSize,
            fontWeight: fontWeights.bold,
            color: isDark ? '#A5B4FC' : '#6366F1',
          }}
        >
          {pair}
        </span>
        <CaretDownOutlined style={{ fontSize: 10, color: isDark ? '#A5B4FC' : '#6366F1' }} />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Price */}
      <span
        style={{
          fontSize: token.fontSize,
          fontWeight: fontWeights.bold,
          color: token.colorText,
        }}
      >
        ${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
      </span>
      
      {/* Price Change Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: '2px 6px',
          borderRadius: 4,
          backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: isPositive ? '#22C55E' : '#EF4444',
          fontSize: 12,
          fontWeight: fontWeights.bold,
        }}
      >
        {isPositive ? <CaretUpOutlined style={{ fontSize: 8 }} /> : <CaretDownOutlined style={{ fontSize: 8 }} />}
        {Math.abs(priceChange).toFixed(2)}%
      </div>
    </div>
  );
};

export default MobileTradeHeader;

