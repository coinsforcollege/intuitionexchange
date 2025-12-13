'use client';

import React, { useState } from 'react';
import { theme, Input, Drawer } from 'antd';
import { SearchOutlined, SwapOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { fontWeights } from '@/theme/themeConfig';

const { useToken } = theme;

interface TradingPair {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  quote: string;
  baseCurrency?: string;
  quoteCurrency?: string;
  iconUrl?: string;
}

interface PairSelectorProps {
  pairs: TradingPair[];
  selectedPair: string;
  onSelectPair: (symbol: string) => void;
  isMobile?: boolean;
}

const BASE_CURRENCIES = ['USD', 'USDT', 'ETH', 'TUIT'];

export const mockPairs: TradingPair[] = [
  { symbol: 'BTC-USD', name: 'Bitcoin', price: 90366.33, change: -2.05, volume: '5.4B', quote: 'USD' },
  { symbol: 'ETH-USD', name: 'Ethereum', price: 3089.72, change: 1.23, volume: '2.1B', quote: 'USD' },
  { symbol: 'SOL-USD', name: 'Solana', price: 132.69, change: 3.45, volume: '890M', quote: 'USD' },
  { symbol: 'XRP-USD', name: 'Ripple', price: 2.34, change: -0.78, volume: '1.2B', quote: 'USD' },
  { symbol: 'DOGE-USD', name: 'Dogecoin', price: 0.42, change: 5.67, volume: '450M', quote: 'USD' },
  { symbol: 'ADA-USD', name: 'Cardano', price: 1.12, change: -1.34, volume: '320M', quote: 'USD' },
  { symbol: 'AVAX-USD', name: 'Avalanche', price: 45.67, change: 2.89, volume: '280M', quote: 'USD' },
  { symbol: 'DOT-USD', name: 'Polkadot', price: 8.90, change: -0.45, volume: '190M', quote: 'USD' },
  { symbol: 'MATIC-USD', name: 'Polygon', price: 0.98, change: 1.56, volume: '210M', quote: 'USD' },
  { symbol: 'LINK-USD', name: 'Chainlink', price: 24.56, change: 4.12, volume: '340M', quote: 'USD' },
  { symbol: 'BTC-USDT', name: 'Bitcoin', price: 90350.00, change: -2.03, volume: '8.2B', quote: 'USDT' },
  { symbol: 'ETH-USDT', name: 'Ethereum', price: 3088.50, change: 1.25, volume: '4.5B', quote: 'USDT' },
  { symbol: 'SOL-USDT', name: 'Solana', price: 132.55, change: 3.48, volume: '1.2B', quote: 'USDT' },
  { symbol: 'XRP-USDT', name: 'Ripple', price: 2.33, change: -0.75, volume: '2.1B', quote: 'USDT' },
  { symbol: 'DOGE-USDT', name: 'Dogecoin', price: 0.419, change: 5.70, volume: '780M', quote: 'USDT' },
  { symbol: 'BTC-ETH', name: 'Bitcoin', price: 29.25, change: -3.12, volume: '120M', quote: 'ETH' },
  { symbol: 'SOL-ETH', name: 'Solana', price: 0.0429, change: 2.15, volume: '45M', quote: 'ETH' },
  { symbol: 'LINK-ETH', name: 'Chainlink', price: 0.00795, change: 2.89, volume: '28M', quote: 'ETH' },
  { symbol: 'BTC-TUIT', name: 'Bitcoin', price: 90366.33, change: -2.05, volume: '12M', quote: 'TUIT' },
  { symbol: 'ETH-TUIT', name: 'Ethereum', price: 3089.72, change: 1.23, volume: '8M', quote: 'TUIT' },
  { symbol: 'SOL-TUIT', name: 'Solana', price: 132.69, change: 3.45, volume: '5M', quote: 'TUIT' },
];

const PairSelector: React.FC<PairSelectorProps> = ({ 
  pairs, 
  selectedPair, 
  onSelectPair,
  isMobile = false,
}) => {
  const { token } = useToken();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeQuote, setActiveQuote] = useState('USD');

  const filteredPairs = pairs.filter(pair => {
    const matchesQuote = pair.quote === activeQuote;
    const matchesSearch = search === '' || 
      pair.symbol.toLowerCase().includes(search.toLowerCase()) ||
      pair.name.toLowerCase().includes(search.toLowerCase());
    return matchesQuote && matchesSearch;
  });

  const formatPrice = (price: number, quote: string) => {
    if (quote === 'ETH') return price.toFixed(4);
    if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (price >= 1) return price.toFixed(2);
    return price.toFixed(4);
  };

  const handlePairClick = (symbol: string) => {
    onSelectPair(symbol);
    if (isMobile) setDrawerOpen(false);
  };

  // Render a single pair item
  const renderPairItem = (pair: TradingPair) => {
    const isSelected = selectedPair === pair.symbol;
    const isPositive = pair.change >= 0;

    return (
      <div
        key={pair.symbol}
        onClick={() => handlePairClick(pair.symbol)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: `${token.paddingXS}px ${token.paddingSM}px`,
          backgroundColor: isSelected ? token.colorPrimary : 'transparent',
          borderRadius: token.borderRadiusSM,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          gap: token.marginXS,
        }}
      >
        <img
          src={pair.iconUrl || `https://assets.coincap.io/assets/icons/${pair.symbol.split('-')[0].toLowerCase()}@2x.png`}
          alt={pair.symbol.split('-')[0]}
          width={28}
          height={28}
          style={{
            borderRadius: '50%',
            flexShrink: 0,
            backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${token.colorPrimary}10`,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${pair.symbol.split('-')[0]}&size=28&background=${isSelected ? 'ffffff' : '799EFF'}&color=${isSelected ? '799EFF' : 'ffffff'}`;
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: token.fontSizeSM,
            fontWeight: fontWeights.semibold,
            color: isSelected ? '#ffffff' : token.colorText,
          }}>
            {pair.symbol.split('-')[0]}
            <span style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : token.colorTextTertiary, fontWeight: fontWeights.normal, fontSize: 11 }}>
              /{pair.quote}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: token.fontSizeSM,
            fontWeight: fontWeights.medium,
            color: isSelected ? '#ffffff' : token.colorText,
          }}>
            {formatPrice(pair.price, pair.quote)}
          </div>
          <div style={{
            fontSize: 11,
            color: isSelected ? 'rgba(255,255,255,0.8)' : (isPositive ? token.colorSuccess : token.colorError),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
          }}>
            {isPositive ? <CaretUpOutlined style={{ fontSize: 9 }} /> : <CaretDownOutlined style={{ fontSize: 9 }} />}
            {Math.abs(pair.change).toFixed(2)}%
          </div>
        </div>
      </div>
    );
  };

  // Search input component
  const searchInput = (
    <Input
      prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
      placeholder="Search pairs..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{ 
        marginBottom: token.marginSM,
      }}
    />
  );

  // Quote tabs component
  const quoteTabs = (
    <div style={{
      display: 'flex',
      gap: token.marginMD,
      marginBottom: token.marginSM,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    }}>
      {BASE_CURRENCIES.map((quote) => (
        <div
          key={quote}
          onClick={() => setActiveQuote(quote)}
          style={{
            padding: `${token.paddingXS}px 0`,
            fontSize: token.fontSize,
            fontWeight: activeQuote === quote ? fontWeights.bold : fontWeights.medium,
            color: activeQuote === quote ? token.colorPrimary : token.colorTextSecondary,
            borderBottom: activeQuote === quote ? `2px solid ${token.colorPrimary}` : '2px solid transparent',
            marginBottom: -1,
            cursor: 'pointer',
          }}
        >
          {quote}
        </div>
      ))}
    </div>
  );

  // Pairs list
  const pairsList = (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {filteredPairs.length === 0 ? (
        <div style={{ padding: token.paddingSM, textAlign: 'center', color: token.colorTextTertiary }}>
          No pairs found
        </div>
      ) : (
        filteredPairs.map(renderPairItem)
      )}
    </div>
  );

  // Mobile view
  if (isMobile) {
    const currentPair = pairs.find(p => p.symbol === selectedPair);
    
    return (
      <>
        <div
          onClick={() => setDrawerOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${token.paddingXS}px 0`,
            cursor: 'pointer',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: token.marginXS }}>
            <SwapOutlined style={{ color: token.colorTextTertiary, fontSize: 12 }} />
            <span style={{ fontWeight: fontWeights.semibold, color: token.colorText, fontSize: token.fontSizeSM }}>
              {selectedPair}
            </span>
          </div>
          <div style={{ 
            color: (currentPair?.change ?? 0) >= 0 ? token.colorSuccess : token.colorError,
            fontWeight: fontWeights.medium,
            fontSize: token.fontSizeSM,
          }}>
            {currentPair ? formatPrice(currentPair.price, currentPair.quote) : '—'}
          </div>
        </div>

        <Drawer
          title="Select Pair"
          placement="bottom"
          height="60vh"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          styles={{ body: { padding: token.paddingSM } }}
        >
          {searchInput}
          {quoteTabs}
          {pairsList}
        </Drawer>
      </>
    );
  }

  // Desktop view
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {searchInput}
      {quoteTabs}
      {pairsList}
    </div>
  );
};

export default PairSelector;
export { mockPairs };
