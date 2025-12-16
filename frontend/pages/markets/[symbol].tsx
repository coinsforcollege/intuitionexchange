import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { theme, Grid, Button, Skeleton, Progress, message, Tooltip } from 'antd';
import {
  ArrowLeftOutlined,
  StarOutlined,
  StarFilled,
  RiseOutlined,
  FallOutlined,
  GlobalOutlined,
  GithubOutlined,
  XOutlined,
  RedditOutlined,
  LinkOutlined,
  SwapOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { useExchange } from '@/context/ExchangeContext';
import { useThemeMode } from '@/context/ThemeContext';
import { getWatchlist, toggleWatchlist } from '@/services/api/watchlist';
import {
  getTokenDetails,
  TokenMarketData,
  formatLargeNumber,
  formatSupply,
} from '@/services/api/coingecko';

const { useToken } = theme;
const { useBreakpoint } = Grid;

// Format date helper
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Key stat item (no background, colored text)
const KeyStat = ({
  label,
  value,
  color,
  subValue,
}: {
  label: string;
  value: React.ReactNode;
  color: string;
  subValue?: React.ReactNode;
}) => {
  const { token } = useToken();

  return (
    <div style={{ textAlign: 'center', padding: `${token.paddingSM}px 0` }}>
      <div style={{
        fontSize: 11,
        color: token.colorTextTertiary,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: token.fontSizeHeading4,
        fontWeight: fontWeights.bold,
        color: color,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      {subValue && (
        <div style={{ marginTop: 4 }}>
          {subValue}
        </div>
      )}
    </div>
  );
};

// Price change badge
const PriceChangeBadge = ({ value, size = 'default' }: { value: number; size?: 'small' | 'default' | 'large' }) => {
  const { token } = useToken();
  const isPositive = value >= 0;
  const sizes = {
    small: { font: token.fontSizeSM, padding: '3px 8px', icon: 10 },
    default: { font: token.fontSize, padding: '6px 12px', icon: 12 },
    large: { font: token.fontSizeLG, padding: '8px 16px', icon: 14 },
  };
  const s = sizes[size];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: s.font,
      fontWeight: fontWeights.semibold,
      color: isPositive ? '#16C47F' : '#fc6f03',
      background: isPositive ? 'rgba(22, 196, 127, 0.15)' : 'rgba(252, 111, 3, 0.15)',
      padding: s.padding,
      borderRadius: 8,
    }}>
      {isPositive ? <RiseOutlined style={{ fontSize: s.icon }} /> : <FallOutlined style={{ fontSize: s.icon }} />}
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
};

// Social link button
const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  const { token } = useToken();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  if (!href) return null;

  return (
    <motion.a
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(102, 126, 234, 0.08)',
        borderRadius: 50,
        color: token.colorText,
        fontSize: token.fontSize,
        fontWeight: fontWeights.medium,
        textDecoration: 'none',
        transition: 'all 0.2s',
      }}
    >
      {icon}
      {label}
    </motion.a>
  );
};

export default function TokenDetailsPage() {
  const router = useRouter();
  const { symbol } = router.query;
  const { token: themeToken } = useToken();
  const { user, isLoading } = useAuth();
  const { pairs, setSelectedPair } = useExchange();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();

  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [tokenData, setTokenData] = useState<TokenMarketData | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const isDark = mode === 'dark';
  const isMobile = mounted ? !screens.md : true;
  const isDesktop = mounted ? screens.lg : false;

  // Get live price from exchange context
  const pairData = useMemo(() => {
    if (!symbol || typeof symbol !== 'string') return null;
    return pairs.find((p) => p.baseCurrency === symbol.toUpperCase() && p.quote === 'USD');
  }, [pairs, symbol]);

  const livePrice = pairData?.price || tokenData?.market_data?.current_price?.usd || 0;
  const liveChange = pairData?.change || tokenData?.market_data?.price_change_percentage_24h || 0;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/login?redirect=/markets/${symbol}`);
        return;
      }
      if (user.kycStatus !== 'APPROVED' && user.kycStatus !== 'PENDING') {
        router.push('/onboarding');
        return;
      }
      setPageLoading(false);
    }
  }, [user, isLoading, router, symbol]);

  useEffect(() => {
    if (!pageLoading && symbol && typeof symbol === 'string') {
      setLoadingToken(true);
      getTokenDetails(symbol.toUpperCase())
        .then((data) => { setTokenData(data); setLoadingToken(false); })
        .catch(() => setLoadingToken(false));
    }
  }, [pageLoading, symbol]);

  useEffect(() => {
    if (!pageLoading && symbol && typeof symbol === 'string') {
      getWatchlist()
        .then((items) => setIsWatchlisted(items.some((item) => item.asset === symbol.toUpperCase())))
        .catch(() => {});
    }
  }, [pageLoading, symbol]);

  const handleToggleWatchlist = useCallback(async () => {
    if (!symbol || typeof symbol !== 'string') return;
    try {
      await toggleWatchlist(symbol.toUpperCase());
      setIsWatchlisted((prev) => !prev);
      message.success(isWatchlisted ? 'Removed from watchlist' : 'Added to watchlist');
    } catch {
      message.error('Failed to update watchlist');
    }
  }, [symbol, isWatchlisted]);

  const handleTrade = useCallback(() => {
    if (!symbol || typeof symbol !== 'string') return;
    setSelectedPair(`${symbol.toUpperCase()}-USD`);
    router.push(`/trade?pair=${symbol.toUpperCase()}-USD`);
  }, [symbol, router, setSelectedPair]);

  const supplyPercentage = useMemo(() => {
    if (!tokenData?.market_data) return 0;
    const { circulating_supply, max_supply, total_supply } = tokenData.market_data;
    const maxOrTotal = max_supply || total_supply;
    if (!maxOrTotal || maxOrTotal === 0) return 100;
    return (circulating_supply / maxOrTotal) * 100;
  }, [tokenData]);

  const cleanDescription = useMemo(() => {
    if (!tokenData?.description) return '';
    return tokenData.description.replace(/<[^>]*>/g, '').replace(/\n\n+/g, '\n\n').trim();
  }, [tokenData]);

  if (pageLoading || !symbol) {
    return (
      <>
        <Head><title>Token Details - InTuition Exchange</title></Head>
        <DashboardLayout activeKey="markets">
          <Skeleton active paragraph={{ rows: 12 }} />
        </DashboardLayout>
      </>
    );
  }

  const symbolStr = typeof symbol === 'string' ? symbol.toUpperCase() : '';
  const separatorColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(102, 126, 234, 0.15)';

  return (
    <>
      <Head>
        <title>{tokenData?.name || symbolStr} ({symbolStr}) - InTuition Exchange</title>
        <meta name="description" content={`View ${tokenData?.name || symbolStr} price, market cap, and more`} />
      </Head>

      <DashboardLayout activeKey="markets">
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Back link */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Link
              href="/markets"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: themeToken.colorPrimary,
                fontSize: themeToken.fontSizeSM,
                fontWeight: fontWeights.medium,
                marginBottom: themeToken.marginMD,
              }}
            >
              <ArrowLeftOutlined />
              Back to Markets
            </Link>
          </motion.div>

          {loadingToken ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : !tokenData ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center',
                padding: themeToken.paddingXL * 2,
                background: isDark ? 'rgba(255,255,255,0.02)' : '#fff',
                borderRadius: themeToken.borderRadiusLG,
              }}
            >
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: themeToken.marginLG,
              }}>
                <ThunderboltOutlined style={{ fontSize: 36, color: '#fff' }} />
              </div>
              <h2 style={{ color: themeToken.colorText, marginBottom: themeToken.marginSM, fontWeight: fontWeights.bold }}>
                {symbolStr}
              </h2>
              <p style={{ color: themeToken.colorTextSecondary, marginBottom: themeToken.marginLG }}>
                Detailed info unavailable, but you can still trade!
              </p>
              <Button
                type="primary"
                size="large"
                icon={<SwapOutlined />}
                onClick={handleTrade}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  height: 48,
                  borderRadius: 50,
                  paddingLeft: 32,
                  paddingRight: 32,
                }}
              >
                Trade {symbolStr}
              </Button>
            </motion.div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? '1fr 360px' : '1fr',
              gap: themeToken.marginLG,
            }}>
              {/* Main content */}
              <div>
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: themeToken.marginMD,
                    marginBottom: themeToken.marginLG,
                  }}
                >
                  <img
                    src={tokenData.image.large}
                    alt={tokenData.name}
                    width={isMobile ? 56 : 72}
                    height={isMobile ? 56 : 72}
                    style={{ borderRadius: '50%' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <h1 style={{
                        fontSize: isMobile ? themeToken.fontSizeHeading3 : themeToken.fontSizeHeading2,
                        fontWeight: fontWeights.bold,
                        color: themeToken.colorText,
                        margin: 0,
                      }}>
                        {tokenData.name}
                      </h1>
                      <span style={{
                        fontSize: themeToken.fontSizeSM,
                        color: themeToken.colorTextSecondary,
                        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(102, 126, 234, 0.1)',
                        padding: '3px 10px',
                        borderRadius: 50,
                        fontWeight: fontWeights.medium,
                      }}>
                        {symbolStr}
                      </span>
                      {tokenData.market_data.market_cap_rank && (
                        <Tooltip title="Market Cap Rank">
                          <span style={{
                            fontSize: themeToken.fontSizeSM,
                            color: '#fff',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '3px 10px',
                            borderRadius: 50,
                            fontWeight: fontWeights.semibold,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}>
                            <TrophyOutlined style={{ fontSize: 11 }} />
                            #{tokenData.market_data.market_cap_rank}
                          </span>
                        </Tooltip>
                      )}
                    </div>
                    {tokenData.categories && tokenData.categories.length > 0 && (
                      <div style={{
                        fontSize: themeToken.fontSizeSM,
                        color: themeToken.colorTextSecondary,
                        marginTop: 4,
                      }}>
                        {tokenData.categories.slice(0, 2).join(' • ')}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Price card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  style={{
                    padding: isMobile ? themeToken.paddingLG : themeToken.paddingXL,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    borderRadius: themeToken.borderRadiusLG,
                    color: '#fff',
                    marginBottom: themeToken.marginLG,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    filter: 'blur(20px)',
                  }} />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: themeToken.fontSizeSM, opacity: 0.8, marginBottom: 4 }}>
                      Current Price
                    </div>
                    <div style={{
                      fontSize: isMobile ? themeToken.fontSizeHeading1 : 56,
                      fontWeight: fontWeights.bold,
                      fontVariantNumeric: 'tabular-nums',
                      lineHeight: 1.1,
                      marginBottom: themeToken.marginSM,
                    }}>
                      ${livePrice.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: livePrice < 1 ? 6 : 2,
                      })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: themeToken.marginMD, flexWrap: 'wrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '6px 14px',
                        borderRadius: 50,
                        background: liveChange >= 0 ? 'rgba(22, 196, 127, 0.3)' : 'rgba(252, 111, 3, 0.3)',
                        fontWeight: fontWeights.semibold,
                      }}>
                        {liveChange >= 0 ? <RiseOutlined /> : <FallOutlined />}
                        {liveChange >= 0 ? '+' : ''}{liveChange.toFixed(2)}% (24h)
                      </span>
                      <span style={{ opacity: 0.8, fontSize: themeToken.fontSizeSM }}>
                        High: ${tokenData.market_data.high_24h.usd?.toLocaleString() || 'N/A'}
                      </span>
                      <span style={{ opacity: 0.8, fontSize: themeToken.fontSizeSM }}>
                        Low: ${tokenData.market_data.low_24h.usd?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Key Stats - no background cards, colored text with separators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    marginBottom: themeToken.marginLG,
                  }}
                >
                  {isMobile ? (
                    // Mobile: 2x2 grid with separators
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      position: 'relative',
                    }}>
                      {/* Vertical separator */}
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        bottom: 0,
                        width: 1,
                        background: separatorColor,
                      }} />
                      {/* Horizontal separator */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: 1,
                        background: separatorColor,
                      }} />
                      
                      <KeyStat
                        label="Market Cap"
                        value={formatLargeNumber(tokenData.market_data.market_cap.usd)}
                        color="#11998e"
                      />
                      <KeyStat
                        label="24h Volume"
                        value={formatLargeNumber(tokenData.market_data.total_volume.usd)}
                        color="#4facfe"
                      />
                      <KeyStat
                        label="Circulating"
                        value={formatSupply(tokenData.market_data.circulating_supply)}
                        color="#fa709a"
                        subValue={
                          tokenData.market_data.max_supply && (
                            <Progress
                              percent={supplyPercentage}
                              size="small"
                              showInfo={false}
                              strokeColor="#fa709a"
                              trailColor={separatorColor}
                              style={{ maxWidth: 80, margin: '0 auto' }}
                            />
                          )
                        }
                      />
                      <KeyStat
                        label="Max Supply"
                        value={tokenData.market_data.max_supply ? formatSupply(tokenData.market_data.max_supply) : '∞'}
                        color="#667eea"
                      />
                    </div>
                  ) : (
                    // Desktop: horizontal row with vertical separators
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <div style={{ flex: 1 }}>
                        <KeyStat
                          label="Market Cap"
                          value={formatLargeNumber(tokenData.market_data.market_cap.usd)}
                          color="#11998e"
                        />
                      </div>
                      <div style={{ width: 1, height: 50, background: separatorColor }} />
                      <div style={{ flex: 1 }}>
                        <KeyStat
                          label="24h Volume"
                          value={formatLargeNumber(tokenData.market_data.total_volume.usd)}
                          color="#4facfe"
                        />
                      </div>
                      <div style={{ width: 1, height: 50, background: separatorColor }} />
                      <div style={{ flex: 1 }}>
                        <KeyStat
                          label="Circulating"
                          value={formatSupply(tokenData.market_data.circulating_supply)}
                          color="#fa709a"
                          subValue={
                            tokenData.market_data.max_supply && (
                              <Progress
                                percent={supplyPercentage}
                                size="small"
                                showInfo={false}
                                strokeColor="#fa709a"
                                trailColor={separatorColor}
                                style={{ maxWidth: 80, margin: '0 auto' }}
                              />
                            )
                          }
                        />
                      </div>
                      <div style={{ width: 1, height: 50, background: separatorColor }} />
                      <div style={{ flex: 1 }}>
                        <KeyStat
                          label="Max Supply"
                          value={tokenData.market_data.max_supply ? formatSupply(tokenData.market_data.max_supply) : '∞'}
                          color="#667eea"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Performance & ATH/ATL - Only on mobile (moved to sidebar on desktop) */}
                {!isDesktop && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                      gap: themeToken.marginMD,
                      marginBottom: themeToken.marginLG,
                    }}
                  >
                    {/* Performance */}
                    <div style={{
                      padding: themeToken.paddingMD,
                      background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                      borderRadius: themeToken.borderRadiusLG,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(102, 126, 234, 0.1)'}`,
                    }}>
                      <h3 style={{
                        fontSize: themeToken.fontSizeLG,
                        fontWeight: fontWeights.semibold,
                        color: themeToken.colorText,
                        margin: `0 0 ${themeToken.marginMD}px 0`,
                      }}>
                        Performance
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: themeToken.marginSM }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: themeToken.colorTextSecondary }}>7 Days</span>
                          <PriceChangeBadge value={tokenData.market_data.price_change_percentage_7d} size="small" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: themeToken.colorTextSecondary }}>30 Days</span>
                          <PriceChangeBadge value={tokenData.market_data.price_change_percentage_30d} size="small" />
                        </div>
                      </div>
                    </div>

                    {/* ATH/ATL */}
                    <div style={{
                      padding: themeToken.paddingMD,
                      background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                      borderRadius: themeToken.borderRadiusLG,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(102, 126, 234, 0.1)'}`,
                    }}>
                      <h3 style={{
                        fontSize: themeToken.fontSizeLG,
                        fontWeight: fontWeights.semibold,
                        color: themeToken.colorText,
                        margin: `0 0 ${themeToken.marginMD}px 0`,
                      }}>
                        All-Time
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: themeToken.marginSM }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ color: '#16C47F', fontWeight: fontWeights.semibold }}>ATH</span>
                            <div style={{ fontSize: themeToken.fontSizeSM, color: themeToken.colorTextTertiary }}>
                              {formatDate(tokenData.market_data.ath_date.usd)}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: fontWeights.semibold, color: themeToken.colorText }}>
                              ${tokenData.market_data.ath.usd?.toLocaleString() || 'N/A'}
                            </div>
                            <PriceChangeBadge value={tokenData.market_data.ath_change_percentage.usd} size="small" />
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ color: '#fc6f03', fontWeight: fontWeights.semibold }}>ATL</span>
                            <div style={{ fontSize: themeToken.fontSizeSM, color: themeToken.colorTextTertiary }}>
                              {formatDate(tokenData.market_data.atl_date.usd)}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: fontWeights.semibold, color: themeToken.colorText }}>
                              ${tokenData.market_data.atl.usd?.toLocaleString() || 'N/A'}
                            </div>
                            <PriceChangeBadge value={tokenData.market_data.atl_change_percentage.usd} size="small" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* About section */}
                {cleanDescription && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      padding: themeToken.paddingLG,
                      background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                      borderRadius: themeToken.borderRadiusLG,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(102, 126, 234, 0.1)'}`,
                      marginBottom: themeToken.marginLG,
                    }}
                  >
                    <h3 style={{
                      fontSize: themeToken.fontSizeLG,
                      fontWeight: fontWeights.semibold,
                      color: themeToken.colorText,
                      margin: `0 0 ${themeToken.marginMD}px 0`,
                    }}>
                      About {tokenData.name}
                    </h3>
                    <div style={{
                      color: themeToken.colorTextSecondary,
                      lineHeight: 1.7,
                      fontSize: themeToken.fontSize,
                    }}>
                      {cleanDescription.length > 600 ? `${cleanDescription.substring(0, 600)}...` : cleanDescription}
                    </div>
                    {tokenData.genesis_date && (
                      <div style={{ marginTop: themeToken.marginMD, color: themeToken.colorTextTertiary, fontSize: themeToken.fontSizeSM }}>
                        <strong>Genesis:</strong> {formatDate(tokenData.genesis_date)}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: themeToken.marginSM }}
                >
                  {tokenData.links.homepage[0] && (
                    <SocialLink href={tokenData.links.homepage[0]} icon={<GlobalOutlined />} label="Website" />
                  )}
                  {tokenData.links.whitepaper && (
                    <SocialLink href={tokenData.links.whitepaper} icon={<LinkOutlined />} label="Whitepaper" />
                  )}
                  {tokenData.links.twitter_screen_name && (
                    <SocialLink href={`https://twitter.com/${tokenData.links.twitter_screen_name}`} icon={<XOutlined />} label="Twitter" />
                  )}
                  {tokenData.links.subreddit_url && (
                    <SocialLink href={tokenData.links.subreddit_url} icon={<RedditOutlined />} label="Reddit" />
                  )}
                  {tokenData.links.repos_url.github[0] && (
                    <SocialLink href={tokenData.links.repos_url.github[0]} icon={<GithubOutlined />} label="GitHub" />
                  )}
                </motion.div>
              </div>

              {/* Sidebar - Desktop */}
              {isDesktop && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: themeToken.marginMD }}
                >
                  {/* Action card */}
                  <div style={{
                    padding: themeToken.paddingLG,
                    background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                    borderRadius: themeToken.borderRadiusLG,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(102, 126, 234, 0.1)'}`,
                    position: 'sticky',
                    top: 100,
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: themeToken.marginSM }}>
                      <Button
                        type="primary"
                        icon={<SwapOutlined />}
                        onClick={handleTrade}
                        block
                        size="large"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          height: 52,
                          borderRadius: themeToken.borderRadiusLG,
                          fontWeight: fontWeights.semibold,
                          fontSize: themeToken.fontSizeLG,
                        }}
                      >
                        Trade {symbolStr}
                      </Button>
                      <Button
                        icon={isWatchlisted ? <StarFilled style={{ color: '#f6c343' }} /> : <StarOutlined />}
                        onClick={handleToggleWatchlist}
                        block
                        size="large"
                        style={{
                          height: 52,
                          borderRadius: themeToken.borderRadiusLG,
                          fontWeight: fontWeights.medium,
                        }}
                      >
                        {isWatchlisted ? 'Watching' : 'Add to Watchlist'}
                      </Button>
                    </div>
                  </div>

                  {/* Performance - Desktop sidebar */}
                  <div style={{
                    padding: themeToken.paddingMD,
                    background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                    borderRadius: themeToken.borderRadiusLG,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(102, 126, 234, 0.1)'}`,
                  }}>
                    <h3 style={{
                      fontSize: themeToken.fontSizeLG,
                      fontWeight: fontWeights.semibold,
                      color: themeToken.colorText,
                      margin: `0 0 ${themeToken.marginMD}px 0`,
                    }}>
                      Performance
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: themeToken.marginSM }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: themeToken.colorTextSecondary }}>7 Days</span>
                        <PriceChangeBadge value={tokenData.market_data.price_change_percentage_7d} size="small" />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: themeToken.colorTextSecondary }}>30 Days</span>
                        <PriceChangeBadge value={tokenData.market_data.price_change_percentage_30d} size="small" />
                      </div>
                    </div>
                  </div>

                  {/* ATH/ATL - Desktop sidebar */}
                  <div style={{
                    padding: themeToken.paddingMD,
                    background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                    borderRadius: themeToken.borderRadiusLG,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(102, 126, 234, 0.1)'}`,
                  }}>
                    <h3 style={{
                      fontSize: themeToken.fontSizeLG,
                      fontWeight: fontWeights.semibold,
                      color: themeToken.colorText,
                      margin: `0 0 ${themeToken.marginMD}px 0`,
                    }}>
                      All-Time
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: themeToken.marginSM }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ color: '#16C47F', fontWeight: fontWeights.semibold }}>ATH</span>
                          <div style={{ fontSize: themeToken.fontSizeSM, color: themeToken.colorTextTertiary }}>
                            {formatDate(tokenData.market_data.ath_date.usd)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: fontWeights.semibold, color: themeToken.colorText }}>
                            ${tokenData.market_data.ath.usd?.toLocaleString() || 'N/A'}
                          </div>
                          <PriceChangeBadge value={tokenData.market_data.ath_change_percentage.usd} size="small" />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ color: '#fc6f03', fontWeight: fontWeights.semibold }}>ATL</span>
                          <div style={{ fontSize: themeToken.fontSizeSM, color: themeToken.colorTextTertiary }}>
                            {formatDate(tokenData.market_data.atl_date.usd)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: fontWeights.semibold, color: themeToken.colorText }}>
                            ${tokenData.market_data.atl.usd?.toLocaleString() || 'N/A'}
                          </div>
                          <PriceChangeBadge value={tokenData.market_data.atl_change_percentage.usd} size="small" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Community stats */}
                  <div style={{
                    padding: themeToken.paddingMD,
                    background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                    borderRadius: themeToken.borderRadiusLG,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(102, 126, 234, 0.1)'}`,
                  }}>
                    <div style={{
                      fontSize: 11,
                      color: themeToken.colorTextTertiary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: themeToken.marginSM,
                    }}>
                      Community
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: themeToken.marginXS }}>
                      {tokenData.community_data.twitter_followers > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: themeToken.colorTextSecondary }}>Twitter</span>
                          <span style={{ color: themeToken.colorText, fontWeight: fontWeights.medium }}>
                            {tokenData.community_data.twitter_followers.toLocaleString()} followers
                          </span>
                        </div>
                      )}
                      {tokenData.community_data.reddit_subscribers > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: themeToken.colorTextSecondary }}>Reddit</span>
                          <span style={{ color: themeToken.colorText, fontWeight: fontWeights.medium }}>
                            {tokenData.community_data.reddit_subscribers.toLocaleString()} members
                          </span>
                        </div>
                      )}
                      {tokenData.watchlist_portfolio_users > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: themeToken.colorTextSecondary }}>Watchlists</span>
                          <span style={{ color: themeToken.colorText, fontWeight: fontWeights.medium }}>
                            {tokenData.watchlist_portfolio_users.toLocaleString()} users
                          </span>
                        </div>
                      )}
                      {tokenData.sentiment_votes_up_percentage > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: themeToken.colorTextSecondary }}>Sentiment</span>
                          <span style={{ color: '#16C47F', fontWeight: fontWeights.medium }}>
                            {tokenData.sentiment_votes_up_percentage.toFixed(0)}% Bullish
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Mobile fixed bottom CTA */}
          {isMobile && tokenData && (
            <div style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: themeToken.paddingMD,
              background: isDark ? 'rgba(10,10,15,0.95)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              zIndex: 100,
              display: 'flex',
              gap: themeToken.marginSM,
            }}>
              <Button
                icon={isWatchlisted ? <StarFilled style={{ color: '#f6c343' }} /> : <StarOutlined />}
                onClick={handleToggleWatchlist}
                size="large"
                style={{ height: 48, width: 48, borderRadius: themeToken.borderRadiusLG, padding: 0 }}
              />
              <Button
                type="primary"
                icon={<SwapOutlined />}
                onClick={handleTrade}
                size="large"
                block
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  height: 48,
                  borderRadius: themeToken.borderRadiusLG,
                  fontWeight: fontWeights.semibold,
                }}
              >
                Trade {symbolStr}
              </Button>
            </div>
          )}

          {/* Bottom padding for mobile CTA */}
          {isMobile && tokenData && <div style={{ height: 80 }} />}
        </div>
      </DashboardLayout>
    </>
  );
}
