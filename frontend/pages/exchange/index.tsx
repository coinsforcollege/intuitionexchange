import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { theme, Grid, Skeleton, Tabs, message } from 'antd';
import { LineChartOutlined, DollarOutlined, HistoryOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { TradingChart, PairSelector, TradeForm } from '@/components/exchange';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { ExchangeProvider, useExchange } from '@/context/ExchangeContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

// Inner component that uses the exchange context
function ExchangePageContent() {
  const router = useRouter();
  const { token } = useToken();
  const { user, isLoading } = useAuth();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  const {
    pairs,
    isLoadingPairs,
    selectedPair,
    setSelectedPair,
    currentPairData,
    currentPrice,
    priceChange,
    candles,
    isLoadingCandles,
    candleGranularity,
    setCandleGranularity,
    getBalance,
    orders,
    isLoadingOrders,
    publicTrades,
    isLoadingTrades,
    orderBook,
    isLoadingOrderBook,
    executeTrade,
    isTrading,
  } = useExchange();

  const isMobile = mounted ? !screens.md : false;
  const isTablet = mounted ? (screens.md && !screens.lg) : false;
  
  const [baseAsset, quoteAsset] = selectedPair.split('-');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?redirect=/exchange');
        return;
      }
      if (user.kycStatus !== 'APPROVED' && user.kycStatus !== 'PENDING') {
        router.push('/onboarding');
        return;
      }
      setPageLoading(false);
    }
  }, [user, isLoading, router]);

  // Handle trade execution
  const handleTrade = async (side: 'BUY' | 'SELL', amount: number, total: number) => {
    const success = await executeTrade(side, amount, total);
    if (success) {
      message.success(`${side} order placed successfully!`);
    } else {
      message.error(`Failed to place ${side} order`);
    }
  };

  const baseBalance = getBalance(baseAsset);
  const quoteBalance = getBalance(quoteAsset);

  const sectionStyle: React.CSSProperties = {
    marginBottom: token.marginSM,
  };

  // Loading skeleton that matches 3-column layout
  if (pageLoading || isLoadingPairs) {
    const PAIR_WIDTH = 300;
    const TRADE_WIDTH = 400;
    return (
      <>
        <Head>
          <title>Trade - InTuition Exchange</title>
        </Head>
        <DashboardLayout activeKey="exchange" fullWidth>
          <div style={{ display: 'flex', width: '100%' }}>
            {/* Left - Markets skeleton */}
            <div style={{ 
              width: PAIR_WIDTH, 
              minWidth: PAIR_WIDTH, 
              borderRight: `1px solid ${token.colorBorderSecondary}`,
              paddingRight: token.paddingMD,
            }}>
              <Skeleton.Input active style={{ width: '100%', marginBottom: token.marginSM }} />
              <div style={{ display: 'flex', gap: token.marginXS, marginBottom: token.marginMD }}>
                {[1,2,3,4].map(i => <Skeleton.Button key={i} active size="small" />)}
              </div>
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: token.marginSM, marginBottom: token.marginSM }}>
                  <Skeleton.Avatar active size="small" />
                  <Skeleton.Input active size="small" style={{ width: 80 }} />
                  <Skeleton.Input active size="small" style={{ width: 50 }} />
                </div>
              ))}
            </div>

            {/* Center - Chart skeleton */}
            <div style={{ flex: 1, minWidth: 0, borderRight: `1px solid ${token.colorBorderSecondary}`, padding: `0 ${token.paddingMD}px` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: token.marginMD }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
                  <Skeleton.Avatar active size={40} />
                  <div>
                    <Skeleton.Input active size="small" style={{ width: 100, marginBottom: 4 }} />
                    <Skeleton.Input active size="small" style={{ width: 60 }} />
                  </div>
                </div>
                <div>
                  <Skeleton.Input active style={{ width: 100 }} />
                </div>
              </div>
              <Skeleton.Node active style={{ width: '100%', height: 280 }}>
                <LineChartOutlined style={{ fontSize: 40, color: token.colorTextQuaternary }} />
              </Skeleton.Node>
              <div style={{ marginTop: token.marginMD }}>
                <Skeleton active paragraph={{ rows: 3 }} title={false} />
              </div>
            </div>

            {/* Right - Trade form skeleton */}
            <div style={{ width: TRADE_WIDTH, minWidth: TRADE_WIDTH, padding: `0 ${token.paddingMD}px` }}>
              <div style={{ display: 'flex', gap: token.marginXS, marginBottom: token.marginMD }}>
                <Skeleton.Button active block />
                <Skeleton.Button active block />
              </div>
              <Skeleton.Input active style={{ width: '100%', marginBottom: token.marginSM }} />
              <Skeleton.Input active style={{ width: '100%', marginBottom: token.marginSM }} />
              <div style={{ display: 'flex', gap: token.marginXS, marginBottom: token.marginMD }}>
                {[1,2,3,4].map(i => <Skeleton.Button key={i} active size="small" style={{ flex: 1 }} />)}
              </div>
              <Skeleton.Button active block size="large" />
            </div>
          </div>
        </DashboardLayout>
      </>
    );
  }

  // Mobile layout
  if (isMobile) {
    return (
      <>
        <Head>
          <title>Trade {selectedPair} - InTuition Exchange</title>
        </Head>
        <DashboardLayout activeKey="exchange" fullWidth>
          <motion.div
            style={sectionStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: token.fontSizeHeading3, fontWeight: fontWeights.bold, color: token.colorText }}>
                  ${currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: token.fontSizeSM, color: priceChange >= 0 ? token.colorSuccess : token.colorError }}>
                  {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={sectionStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <PairSelector
              pairs={pairs}
              selectedPair={selectedPair}
              onSelectPair={setSelectedPair}
              isMobile={true}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Tabs
              defaultActiveKey="trade"
              centered
              items={[
                {
                  key: 'chart',
                  label: <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}><LineChartOutlined /> Chart</span>,
                  children: (
                    <TradingChart
                      candles={candles}
                      isLoading={isLoadingCandles}
                      granularity={candleGranularity}
                      onGranularityChange={setCandleGranularity}
                    />
                  ),
                },
                {
                  key: 'trade',
                  label: <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}><DollarOutlined /> Trade</span>,
                  children: (
                    <TradeForm
                      symbol={selectedPair}
                      price={currentPrice}
                      baseAsset={baseAsset}
                      quoteAsset={quoteAsset}
                      baseBalance={baseBalance}
                      quoteBalance={quoteBalance}
                      onTrade={handleTrade}
                      isLoading={isTrading}
                    />
                  ),
                },
                {
                  key: 'history',
                  label: <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}><HistoryOutlined /> Orders</span>,
                  children: (
                    <OrderHistory orders={orders} isLoading={isLoadingOrders} />
                  ),
                },
              ]}
            />
          </motion.div>
        </DashboardLayout>
      </>
    );
  }

  // Desktop layout - Fixed width side columns, flexible center, 100vh height
  const PAIR_COLUMN_WIDTH = 300;
  const TRADE_COLUMN_WIDTH = 400;

  return (
    <>
      <Head>
        <title>Trade {selectedPair} - InTuition Exchange</title>
      </Head>
      <DashboardLayout activeKey="exchange" fullWidth>
        <div style={{ 
          display: 'flex', 
          width: '100%', 
          height: '100%',
          overflow: 'hidden',
        }}>
          {/* Left - Pairs (fixed width) */}
          {!isTablet && (
            <div style={{ 
              width: PAIR_COLUMN_WIDTH, 
              minWidth: PAIR_COLUMN_WIDTH, 
              maxWidth: PAIR_COLUMN_WIDTH,
              borderRight: `1px solid ${token.colorBorderSecondary}`,
              flexShrink: 0,
              height: '100%',
              overflow: 'hidden',
            }}>
              <div style={{ height: '100%', paddingLeft: token.paddingMD, paddingRight: token.paddingSM }}>
                <PairSelector
                  pairs={pairs}
                  selectedPair={selectedPair}
                  onSelectPair={setSelectedPair}
                />
              </div>
            </div>
          )}

          {/* Middle - Chart & Market Data (flexible, 50-50 split) */}
          <div style={{ 
            flex: 1, 
            minWidth: 0,
            borderRight: `1px solid ${token.colorBorderSecondary}`,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}>
            {/* Top Half - Chart with price header */}
            <div style={{ 
              flex: 1, 
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              padding: `0 ${token.paddingMD}px`,
            }}>
              {isTablet && (
                <div style={{ marginBottom: token.marginXS }}>
                  <PairSelector pairs={pairs} selectedPair={selectedPair} onSelectPair={setSelectedPair} isMobile={true} />
                </div>
              )}

              {/* Compact Price Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: `${token.paddingSM}px 0`,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
                  <img
                    src={currentPairData?.iconUrl || `https://assets.coincap.io/assets/icons/${baseAsset.toLowerCase()}@2x.png`}
                    alt={baseAsset}
                    width={32}
                    height={32}
                    style={{ borderRadius: '50%' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${baseAsset}&background=799EFF&color=fff`; }}
                  />
                  <div>
                    <div style={{ fontSize: token.fontSizeLG, fontWeight: fontWeights.bold, color: token.colorText, lineHeight: 1.2 }}>
                      {baseAsset}/{quoteAsset}
                    </div>
                    <div style={{ fontSize: token.fontSizeSM, color: token.colorTextTertiary, lineHeight: 1.2 }}>
                      {currentPairData?.name || baseAsset}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: token.marginMD }}>
                  <span style={{ 
                    fontSize: token.fontSizeHeading4, 
                    fontWeight: fontWeights.bold, 
                    color: token.colorText,
                    lineHeight: 1.2,
                  }}>
                    ${currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </span>
                  <span style={{ 
                    fontSize: token.fontSize, 
                    fontWeight: fontWeights.semibold,
                    color: priceChange >= 0 ? token.colorSuccess : token.colorError,
                    lineHeight: 1.2,
                  }}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Chart - fills remaining space */}
              <div style={{ flex: 1, minHeight: 0 }}>
                <TradingChart
                  candles={candles}
                  isLoading={isLoadingCandles}
                  granularity={candleGranularity}
                  onGranularityChange={setCandleGranularity}
                />
              </div>
            </div>

            {/* Bottom Half - Two columns: Trade History | Order Book/My Orders */}
            <div style={{ 
              flex: 1, 
              minHeight: 0,
              display: 'flex',
              gap: token.marginMD,
              padding: `${token.paddingXS}px ${token.paddingMD}px`,
              overflow: 'hidden',
            }}>
              {/* Left - Trade History */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                  fontSize: token.fontSizeSM, 
                  fontWeight: fontWeights.semibold, 
                  color: token.colorTextSecondary, 
                  marginBottom: token.marginXS,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Trade History
                </div>
                <TradeHistoryCompact trades={publicTrades} isLoading={isLoadingTrades} />
              </div>
              {/* Right - Order Book + My Orders Tab Group */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <Tabs
                  defaultActiveKey="orderbook"
                  size="small"
                  style={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    minHeight: 0,
                  }}
                  items={[
                    {
                      key: 'orderbook',
                      label: <span style={{ fontSize: token.fontSizeSM, fontWeight: fontWeights.medium }}>Order Book</span>,
                      children: (
                        <div style={{ height: '100%', minHeight: 0 }}>
                          <OrderBookCompact orderBook={orderBook} isLoading={isLoadingOrderBook} />
                        </div>
                      ),
                    },
                    {
                      key: 'orders',
                      label: <span style={{ fontSize: token.fontSizeSM, fontWeight: fontWeights.medium }}><HistoryOutlined /> My Orders</span>,
                      children: (
                        <div style={{ height: '100%', minHeight: 0 }}>
                          <OrderHistory orders={orders} isLoading={isLoadingOrders} />
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Right - Trade Form (fixed width) */}
          <div style={{ 
            width: TRADE_COLUMN_WIDTH, 
            minWidth: TRADE_COLUMN_WIDTH, 
            maxWidth: TRADE_COLUMN_WIDTH,
            flexShrink: 0,
            height: '100%',
            overflowY: 'auto',
            padding: `${token.paddingSM}px ${token.paddingMD}px`,
          }}>
            <TradeForm
              symbol={selectedPair}
              price={currentPrice}
              baseAsset={baseAsset}
              quoteAsset={quoteAsset}
              baseBalance={baseBalance}
              quoteBalance={quoteBalance}
              onTrade={handleTrade}
              isLoading={isTrading}
            />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

// Order history component - Shows all orders with time
function OrderHistory({ orders, isLoading }: { orders: any[]; isLoading: boolean }) {
  const { token } = theme.useToken();

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div style={{ 
        padding: token.paddingLG, 
        textAlign: 'center', 
        color: token.colorTextTertiary, 
        fontSize: token.fontSizeSM 
      }}>
        <HistoryOutlined style={{ fontSize: 24, marginRight: token.marginXS, opacity: 0.4 }} />
        No orders yet
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: 0,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        padding: `${token.paddingXS}px 0`,
        fontSize: token.fontSizeSM,
        color: token.colorTextSecondary,
        fontWeight: fontWeights.semibold,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        marginBottom: token.marginXS,
      }}>
        <span style={{ flex: 1 }}>Side/Pair</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Value</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Time</span>
      </div>
      {/* Scrollable content - show ALL orders */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        minHeight: 0,
      }}>
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: `${token.paddingXXS}px 0`,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              fontSize: token.fontSizeSM,
            }}
          >
            <div style={{ flex: 1 }}>
              <span style={{ 
                color: order.side === 'BUY' ? token.colorSuccess : token.colorError, 
                fontWeight: fontWeights.semibold 
              }}>
                {order.side}
              </span>
              <span style={{ color: token.colorTextSecondary, marginLeft: token.marginXS }}>
                {order.productId}
              </span>
            </div>
            <div style={{ flex: 1, textAlign: 'right', color: token.colorText, fontWeight: fontWeights.medium }}>
              ${order.totalValue.toFixed(2)}
            </div>
            <div style={{ 
              flex: 1, 
              textAlign: 'right', 
              color: token.colorTextTertiary,
              fontSize: token.fontSizeSM,
            }}>
              {new Date(order.createdAt).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Trade History - Shows all trades with scroll
function TradeHistoryCompact({ trades, isLoading }: { trades: any[]; isLoading: boolean }) {
  const { token } = theme.useToken();

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  if (!trades || trades.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: token.colorTextTertiary, 
        fontSize: token.fontSizeSM, 
        padding: token.paddingLG 
      }}>
        No trades
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: 0,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        padding: `${token.paddingXS}px 0`,
        fontSize: token.fontSizeSM,
        color: token.colorTextSecondary,
        fontWeight: fontWeights.semibold,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        marginBottom: token.marginXS,
      }}>
        <span style={{ flex: 1 }}>Price</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Size</span>
      </div>
      {/* Scrollable content - show ALL trades */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        minHeight: 0,
      }}>
        {trades.map((trade, idx) => (
          <div
            key={trade.trade_id || idx}
            style={{
              display: 'flex',
              padding: `${token.paddingXXS}px 0`,
              fontSize: token.fontSizeSM,
              fontFamily: 'monospace',
            }}
          >
            <span style={{ 
              flex: 1, 
              color: trade.side === 'BUY' ? token.colorSuccess : token.colorError,
              fontWeight: fontWeights.medium,
            }}>
              {parseFloat(trade.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span style={{ 
              flex: 1, 
              textAlign: 'right', 
              color: token.colorText,
              fontWeight: fontWeights.medium,
            }}>
              {parseFloat(trade.size).toFixed(6)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Order Book - Two columns: Bids | Asks, shows all data
function OrderBookCompact({ orderBook, isLoading }: { orderBook: any; isLoading: boolean }) {
  const { token } = theme.useToken();

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  if (!orderBook || (!orderBook.bids?.length && !orderBook.asks?.length)) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: token.colorTextTertiary, 
        fontSize: token.fontSizeSM, 
        padding: token.paddingLG 
      }}>
        No data
      </div>
    );
  }

  // Show ALL bids and asks
  const bids = orderBook.bids || [];
  const asks = orderBook.asks || [];
  const maxRows = Math.max(bids.length, asks.length);

  // Calculate max size for bar width
  const allSizes = [...bids, ...asks].map(o => parseFloat(o.size));
  const maxSize = Math.max(...allSizes, 0.0001);

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: 0,
    }}>
      {/* Two-column header */}
      <div style={{ display: 'flex', gap: token.marginMD }}>
        {/* Bids Header */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          fontSize: token.fontSizeSM, 
          color: token.colorTextSecondary, 
          fontWeight: fontWeights.semibold, 
          borderBottom: `1px solid ${token.colorBorderSecondary}`, 
          padding: `${token.paddingXS}px 0`,
          marginBottom: token.marginXS,
        }}>
          <span style={{ flex: 1 }}>Bid</span>
          <span style={{ flex: 1, textAlign: 'right' }}>Size</span>
        </div>
        {/* Asks Header */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          fontSize: token.fontSizeSM, 
          color: token.colorTextSecondary, 
          fontWeight: fontWeights.semibold, 
          borderBottom: `1px solid ${token.colorBorderSecondary}`, 
          padding: `${token.paddingXS}px 0`,
          marginBottom: token.marginXS,
        }}>
          <span style={{ flex: 1 }}>Ask</span>
          <span style={{ flex: 1, textAlign: 'right' }}>Size</span>
        </div>
      </div>

      {/* Scrollable rows - show ALL data */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        minHeight: 0,
      }}>
        {Array.from({ length: maxRows }).map((_, idx) => {
          const bid = bids[idx];
          const ask = asks[idx];
          
          return (
            <div key={idx} style={{ display: 'flex', gap: token.marginMD }}>
              {/* Bid */}
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                padding: `${token.paddingXXS}px 0`, 
                position: 'relative', 
                fontFamily: 'monospace',
                fontSize: token.fontSizeSM,
              }}>
                {bid && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      right: 0,
                      width: `${(parseFloat(bid.size) / maxSize) * 100}%`,
                      backgroundColor: `${token.colorSuccess}15`,
                      zIndex: 0,
                    }} />
                    <span style={{ 
                      flex: 1, 
                      color: token.colorSuccess, 
                      position: 'relative', 
                      zIndex: 1,
                      fontWeight: fontWeights.medium,
                    }}>
                      {parseFloat(bid.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span style={{ 
                      flex: 1, 
                      textAlign: 'right', 
                      color: token.colorText, 
                      position: 'relative', 
                      zIndex: 1,
                      fontWeight: fontWeights.medium,
                    }}>
                      {parseFloat(bid.size).toFixed(6)}
                    </span>
                  </>
                )}
              </div>
              {/* Ask */}
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                padding: `${token.paddingXXS}px 0`, 
                position: 'relative', 
                fontFamily: 'monospace',
                fontSize: token.fontSizeSM,
              }}>
                {ask && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: `${(parseFloat(ask.size) / maxSize) * 100}%`,
                      backgroundColor: `${token.colorError}15`,
                      zIndex: 0,
                    }} />
                    <span style={{ 
                      flex: 1, 
                      color: token.colorError, 
                      position: 'relative', 
                      zIndex: 1,
                      fontWeight: fontWeights.medium,
                    }}>
                      {parseFloat(ask.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span style={{ 
                      flex: 1, 
                      textAlign: 'right', 
                      color: token.colorText, 
                      position: 'relative', 
                      zIndex: 1,
                      fontWeight: fontWeights.medium,
                    }}>
                      {parseFloat(ask.size).toFixed(6)}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Main page component wrapped with provider
export default function ExchangePage() {
  return (
    <ExchangeProvider>
      <ExchangePageContent />
    </ExchangeProvider>
  );
}
