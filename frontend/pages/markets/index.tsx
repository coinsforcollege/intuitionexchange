import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { theme, Grid, Input, Skeleton, Empty, Tabs } from 'antd';
import { SearchOutlined, StarOutlined, StarFilled, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { useExchange } from '@/context/ExchangeContext';
import { useThemeMode } from '@/context/ThemeContext';
import { getWatchlist, toggleWatchlist } from '@/services/api/watchlist';

const { useToken } = theme;
const { useBreakpoint } = Grid;

interface MarketRowProps {
  baseCurrency: string;
  name: string;
  iconUrl: string;
  price: number;
  change: number;
  isWatchlisted: boolean;
  onRowClick: () => void;
  onStarClick: () => void;
  isMobile: boolean;
}

const MarketRow = memo(({
  baseCurrency,
  name,
  iconUrl,
  price,
  change,
  isWatchlisted,
  onRowClick,
  onStarClick,
  isMobile,
}: MarketRowProps) => {
  const { token } = useToken();
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: token.marginSM,
        padding: isMobile ? `${token.paddingMD}px 0` : `${token.paddingMD}px ${token.paddingLG}px`,
        background: isMobile ? 'transparent' : token.colorBgContainer,
        borderRadius: isMobile ? 0 : token.borderRadius,
        borderBottom: isMobile ? `1px solid ${token.colorBorderSecondary}` : 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
      onClick={onRowClick}
    >
      <img
        src={iconUrl}
        alt={baseCurrency}
        width={44}
        height={44}
        style={{ borderRadius: '50%' }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${baseCurrency}&background=667eea&color=fff`;
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: token.fontSizeLG, fontWeight: fontWeights.semibold, color: token.colorText }}>
          {baseCurrency}
        </div>
        <div
          style={{
            fontSize: token.fontSizeSM,
            color: token.colorTextSecondary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </div>
      </div>
      <div style={{ textAlign: 'right', marginRight: token.marginSM }}>
        <div style={{ fontSize: token.fontSizeLG, fontWeight: fontWeights.semibold, color: token.colorText }}>
          ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: price < 1 ? 4 : 2 })}
        </div>
        <div
          style={{
            fontSize: token.fontSizeSM,
            fontWeight: fontWeights.medium,
            color: change >= 0 ? token.colorSuccess : token.colorError,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 4,
          }}
        >
          {change >= 0 ? <RiseOutlined /> : <FallOutlined />}
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onStarClick();
        }}
        style={{
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isWatchlisted ? '#f6d365' : token.colorTextSecondary,
          fontSize: token.fontSizeLG,
          cursor: 'pointer',
          borderRadius: '50%',
          transition: 'background-color 0.2s',
        }}
      >
        {isWatchlisted ? <StarFilled /> : <StarOutlined />}
      </div>
    </div>
  );
});
MarketRow.displayName = 'MarketRow';

export default function MarketsPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user, isLoading } = useAuth();
  const { pairs, isLoadingPairs } = useExchange();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlistAssets, setWatchlistAssets] = useState<string[]>([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const isDark = mode === 'dark';
  const isMobile = mounted ? !screens.md : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?redirect=/markets');
        return;
      }
      if (user.kycStatus !== 'APPROVED' && user.kycStatus !== 'PENDING') {
        router.push('/onboarding');
        return;
      }
      setPageLoading(false);
    }
  }, [user, isLoading, router]);

  // Fetch watchlist
  useEffect(() => {
    if (!pageLoading && user) {
      const fetchWatchlist = async () => {
        try {
          setLoadingWatchlist(true);
          const items = await getWatchlist();
          setWatchlistAssets(items.map((item) => item.asset));
        } catch (error) {
          console.error('Failed to fetch watchlist:', error);
          setWatchlistAssets([]);
        } finally {
          setLoadingWatchlist(false);
        }
      };
      fetchWatchlist();
    }
  }, [pageLoading, user]);

  // Get USD pairs
  const usdPairs = useMemo(() => {
    return pairs.filter((p) => p.quote === 'USD');
  }, [pairs]);

  // Filtered and sorted pairs
  const filteredPairs = useMemo(() => {
    let result = [...usdPairs];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.baseCurrency.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query)
      );
    }

    // Tab filter
    if (activeTab === 'watchlist') {
      result = result.filter((p) => watchlistAssets.includes(p.baseCurrency));
    } else if (activeTab === 'gainers') {
      result = result.filter((p) => p.change > 0).sort((a, b) => b.change - a.change);
    } else if (activeTab === 'losers') {
      result = result.filter((p) => p.change < 0).sort((a, b) => a.change - b.change);
    } else {
      // Sort by market cap / volume (use price as proxy for now)
      result = result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [usdPairs, searchQuery, activeTab, watchlistAssets]);

  const handleToggleWatchlist = useCallback(async (asset: string) => {
    try {
      await toggleWatchlist(asset);
      setWatchlistAssets((prev) =>
        prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]
      );
    } catch (error) {
      console.error('Failed to toggle watchlist:', error);
    }
  }, []);

  const handleNavigateToExchange = useCallback((pair: string) => {
    router.push(`/exchange?pair=${pair}-USD`);
  }, [router]);

  if (pageLoading) {
    return (
      <>
        <Head>
          <title>Markets - InTuition Exchange</title>
        </Head>
        <DashboardLayout activeKey="markets">
          <Skeleton active paragraph={{ rows: 12 }} />
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Markets - InTuition Exchange</title>
        <meta name="description" content="Explore crypto markets on InTuition Exchange" />
      </Head>

      <DashboardLayout activeKey="markets">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: token.marginLG }}
          >
            <h1
              style={{
                fontSize: isMobile ? token.fontSizeHeading3 : token.fontSizeHeading2,
                fontWeight: fontWeights.bold,
                color: token.colorText,
                marginBottom: token.marginSM,
              }}
            >
              Markets
            </h1>
            <p style={{ color: token.colorTextSecondary, marginBottom: token.marginMD }}>
              Explore and track cryptocurrency prices
            </p>

            {/* Search */}
            <Input
              prefix={<SearchOutlined style={{ color: token.colorTextSecondary }} />}
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                borderRadius: token.borderRadiusLG,
                padding: `${token.paddingSM}px ${token.paddingMD}px`,
              }}
              size="large"
            />
          </motion.div>

          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: 'all', label: 'All' },
              { key: 'watchlist', label: 'Watchlist' },
              { key: 'gainers', label: 'Gainers' },
              { key: 'losers', label: 'Losers' },
            ]}
            style={{ marginBottom: token.marginMD }}
          />

          {/* Markets list */}
          {isLoadingPairs || loadingWatchlist ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : filteredPairs.length === 0 ? (
            <Empty
              description={
                activeTab === 'watchlist'
                  ? 'No assets in your watchlist'
                  : 'No markets found'
              }
              style={{ padding: token.paddingXL }}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? 0 : token.marginXS,
                background: isMobile ? 'transparent' : undefined,
                borderRadius: isMobile ? 0 : token.borderRadiusLG,
                overflow: 'hidden',
              }}
            >
              {filteredPairs.map((pair) => (
                <MarketRow
                  key={pair.baseCurrency}
                  baseCurrency={pair.baseCurrency}
                  name={pair.name}
                  iconUrl={pair.iconUrl}
                  price={pair.price}
                  change={pair.change}
                  isWatchlisted={watchlistAssets.includes(pair.baseCurrency)}
                  onRowClick={() => handleNavigateToExchange(pair.baseCurrency)}
                  onStarClick={() => handleToggleWatchlist(pair.baseCurrency)}
                  isMobile={isMobile}
                />
              ))}
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}

