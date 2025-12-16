import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { theme, Grid, Skeleton, Empty } from 'antd';
import {
  SwapOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FilterOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'motion/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { useExchange } from '@/context/ExchangeContext';
import { useThemeMode } from '@/context/ThemeContext';
import { getFiatTransactions, FiatTransaction } from '@/services/api/fiat';

const { useToken } = theme;
const { useBreakpoint } = Grid;

type FilterTab = 'all' | 'trades' | 'deposits' | 'withdrawals';

interface Transaction {
  id: string;
  type: 'trade' | 'deposit' | 'withdrawal';
  asset: string;
  amount: number;
  value: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
  side?: 'BUY' | 'SELL';
  date: Date;
  reference?: string | null;
  iconUrl?: string;
}

// Filter pill component
const FilterPill = memo(({
  active,
  onClick,
  children,
  icon,
  count,
  compact,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
  compact?: boolean;
}) => {
  const { token } = useToken();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? 4 : 6,
        padding: compact 
          ? `${token.paddingXS}px ${token.paddingSM}px`
          : `${token.paddingSM}px ${token.paddingMD}px`,
        borderRadius: 50,
        border: 'none',
        cursor: 'pointer',
        fontSize: compact ? token.fontSizeSM : token.fontSize,
        fontWeight: fontWeights.semibold,
        transition: 'all 0.2s',
        background: active 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(102, 126, 234, 0.08)',
        color: active ? '#fff' : token.colorText,
        boxShadow: active ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {icon}
      {children}
      {count !== undefined && count > 0 && (
        <span
          style={{
            background: active ? 'rgba(255,255,255,0.25)' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(102, 126, 234, 0.2)'),
            borderRadius: 10,
            padding: '2px 6px',
            fontSize: 11,
            fontWeight: fontWeights.bold,
            marginLeft: 2,
          }}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
});
FilterPill.displayName = 'FilterPill';

// Transaction card for mobile
const TransactionCard = memo(({
  transaction,
  onCardClick,
  compact,
}: {
  transaction: Transaction;
  onCardClick?: () => void;
  compact?: boolean;
}) => {
  const { token } = useToken();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const getTypeIcon = () => {
    if (transaction.type === 'trade') {
      return transaction.side === 'BUY' ? <ArrowDownOutlined /> : <ArrowUpOutlined />;
    }
    if (transaction.type === 'deposit') return <ArrowDownOutlined />;
    return <ArrowUpOutlined />;
  };

  const getTypeColor = () => {
    if (transaction.type === 'trade') {
      return transaction.side === 'BUY' ? '#16C47F' : '#fc6f03';
    }
    if (transaction.type === 'deposit') return '#16C47F';
    return '#fc6f03';
  };

  const getTypeGradient = () => {
    const color = getTypeColor();
    return `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`;
  };

  const getTypeLabel = () => {
    if (transaction.type === 'trade') {
      return transaction.side === 'BUY' ? 'Bought' : 'Sold';
    }
    if (transaction.type === 'deposit') return 'Deposited';
    return 'Withdrew';
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'COMPLETED': return <CheckCircleOutlined style={{ color: '#16C47F' }} />;
      case 'PENDING': return <ClockCircleOutlined style={{ color: '#d6ac20' }} />;
      case 'FAILED':
      case 'CANCELLED': return <CloseCircleOutlined style={{ color: '#fc6f03' }} />;
      default: return null;
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return d.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={onCardClick}
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 100%)'
          : 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
        borderRadius: token.borderRadiusLG,
        padding: compact ? token.paddingSM : token.paddingMD,
        cursor: onCardClick ? 'pointer' : 'default',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(102, 126, 234, 0.1)'}`,
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle type indicator on left */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: getTypeColor(),
          borderRadius: '4px 0 0 4px',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
        {/* Icon */}
        <div
          style={{
            width: compact ? 40 : 48,
            height: compact ? 40 : 48,
            borderRadius: '50%',
            background: getTypeGradient(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getTypeColor(),
            fontSize: compact ? 16 : 20,
            flexShrink: 0,
          }}
        >
          {transaction.iconUrl ? (
            <img
              src={transaction.iconUrl}
              alt={transaction.asset}
              width={compact ? 24 : 28}
              height={compact ? 24 : 28}
              style={{ borderRadius: '50%' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling!.removeAttribute('style');
              }}
            />
          ) : null}
          {!transaction.iconUrl && getTypeIcon()}
        </div>

        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: token.marginXS }}>
            <span
              style={{
                fontSize: compact ? token.fontSize : token.fontSizeLG,
                fontWeight: fontWeights.semibold,
                color: token.colorText,
              }}
            >
              {getTypeLabel()} {transaction.asset}
            </span>
            {getStatusIcon()}
          </div>
          <div
            style={{
              fontSize: token.fontSizeSM,
              color: token.colorTextSecondary,
              marginTop: 2,
            }}
          >
            {formatDate(transaction.date)}
          </div>
        </div>

        {/* Amount */}
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: compact ? token.fontSize : token.fontSizeLG,
              fontWeight: fontWeights.bold,
              color: token.colorText,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {transaction.type === 'trade' && transaction.side === 'BUY' ? '+' : ''}
            {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
            {transaction.type === 'trade' && transaction.side === 'SELL' ? '-' : ''}
            {transaction.amount.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: transaction.amount < 1 ? 6 : 2,
            })} {transaction.asset}
          </div>
          <div
            style={{
              fontSize: token.fontSizeSM,
              color: token.colorTextSecondary,
              marginTop: 2,
            }}
          >
            ${transaction.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
TransactionCard.displayName = 'TransactionCard';

// Transaction row for desktop list view
const TransactionRow = memo(({
  transaction,
  onRowClick,
}: {
  transaction: Transaction;
  onRowClick?: () => void;
}) => {
  const { token } = useToken();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const getTypeIcon = () => {
    if (transaction.type === 'trade') {
      return transaction.side === 'BUY' ? <ArrowDownOutlined /> : <ArrowUpOutlined />;
    }
    if (transaction.type === 'deposit') return <ArrowDownOutlined />;
    return <ArrowUpOutlined />;
  };

  const getTypeColor = () => {
    if (transaction.type === 'trade') {
      return transaction.side === 'BUY' ? '#16C47F' : '#fc6f03';
    }
    if (transaction.type === 'deposit') return '#16C47F';
    return '#fc6f03';
  };

  const getTypeLabel = () => {
    if (transaction.type === 'trade') {
      return transaction.side === 'BUY' ? 'Buy' : 'Sell';
    }
    if (transaction.type === 'deposit') return 'Deposit';
    return 'Withdrawal';
  };

  const getStatusBadge = () => {
    const colors: Record<string, { bg: string; text: string }> = {
      COMPLETED: { bg: 'rgba(22, 196, 127, 0.12)', text: '#16C47F' },
      PENDING: { bg: 'rgba(214, 172, 32, 0.12)', text: '#d6ac20' },
      FAILED: { bg: 'rgba(252, 111, 3, 0.12)', text: '#fc6f03' },
      CANCELLED: { bg: 'rgba(150, 150, 150, 0.12)', text: '#999' },
    };
    const style = colors[transaction.status] || colors.PENDING;
    
    return (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: 6,
          background: style.bg,
          color: style.text,
          fontSize: token.fontSizeSM,
          fontWeight: fontWeights.medium,
        }}
      >
        {transaction.status}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(102, 126, 234, 0.03)' }}
      onClick={onRowClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1fr 100px',
        alignItems: 'center',
        gap: token.marginMD,
        padding: `${token.paddingSM}px ${token.paddingMD}px`,
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        cursor: onRowClick ? 'pointer' : 'default',
        transition: 'background-color 0.15s',
      }}
    >
      {/* Type & Asset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `${getTypeColor()}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getTypeColor(),
            fontSize: 14,
          }}
        >
          {transaction.iconUrl ? (
            <img
              src={transaction.iconUrl}
              alt={transaction.asset}
              width={24}
              height={24}
              style={{ borderRadius: '50%' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${transaction.asset}&background=667eea&color=fff&size=48`;
              }}
            />
          ) : getTypeIcon()}
        </div>
        <div>
          <div style={{ fontWeight: fontWeights.semibold, color: token.colorText }}>
            {getTypeLabel()} {transaction.asset}
          </div>
          <div style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
            {new Date(transaction.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>

      {/* Amount */}
      <div style={{ fontVariantNumeric: 'tabular-nums' }}>
        <div style={{ fontWeight: fontWeights.semibold, color: token.colorText }}>
          {transaction.amount.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: transaction.amount < 1 ? 6 : 4,
          })}
        </div>
        <div style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
          {transaction.asset}
        </div>
      </div>

      {/* Value */}
      <div style={{ fontWeight: fontWeights.semibold, color: token.colorText, fontVariantNumeric: 'tabular-nums' }}>
        ${transaction.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

      {/* Status */}
      <div>{getStatusBadge()}</div>

      {/* Change indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 4,
          color: transaction.type === 'withdrawal' || (transaction.type === 'trade' && transaction.side === 'SELL') 
            ? '#fc6f03' 
            : '#16C47F',
          fontWeight: fontWeights.semibold,
          fontSize: token.fontSize,
        }}
      >
        {transaction.type === 'withdrawal' || (transaction.type === 'trade' && transaction.side === 'SELL') 
          ? <ArrowUpOutlined /> 
          : <ArrowDownOutlined />}
        {transaction.type === 'withdrawal' || (transaction.type === 'trade' && transaction.side === 'SELL') 
          ? '-' 
          : '+'}
        ${Math.abs(transaction.value).toFixed(2)}
      </div>
    </motion.div>
  );
});
TransactionRow.displayName = 'TransactionRow';

export default function TransactionsPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user, isLoading } = useAuth();
  const { orders, isLoadingOrders, pairs } = useExchange();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [fiatTransactions, setFiatTransactions] = useState<FiatTransaction[]>([]);
  const [loadingFiat, setLoadingFiat] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const isDark = mode === 'dark';
  const isMobile = mounted ? !screens.md : true;
  const isTablet = mounted ? screens.md && !screens.lg : false;
  const useCompactFilters = isMobile || isTablet;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?redirect=/transactions');
        return;
      }
      if (user.kycStatus !== 'APPROVED' && user.kycStatus !== 'PENDING') {
        router.push('/onboarding');
        return;
      }
      setPageLoading(false);
    }
  }, [user, isLoading, router]);

  // Fetch fiat transactions
  useEffect(() => {
    if (!pageLoading && user) {
      const fetchFiat = async () => {
        try {
          setLoadingFiat(true);
          const { transactions } = await getFiatTransactions({ limit: 100 });
          setFiatTransactions(transactions);
        } catch (error) {
          console.error('Failed to fetch fiat transactions:', error);
          setFiatTransactions([]);
        } finally {
          setLoadingFiat(false);
        }
      };
      fetchFiat();
    }
  }, [pageLoading, user]);

  // Get icon URL for an asset
  const getIconUrl = useCallback((asset: string) => {
    if (asset === 'USD') return undefined;
    const pair = pairs.find(p => p.baseCurrency === asset);
    return pair?.iconUrl || `https://assets.coincap.io/assets/icons/${asset.toLowerCase()}@2x.png`;
  }, [pairs]);

  // Combine and transform all transactions
  const allTransactions = useMemo((): Transaction[] => {
    const result: Transaction[] = [];

    // Add trade orders
    orders.forEach(order => {
      result.push({
        id: `trade-${order.id}`,
        type: 'trade',
        asset: order.asset,
        amount: order.filledAmount,
        value: order.totalValue,
        status: order.status as 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED',
        side: order.side,
        date: new Date(order.createdAt),
        iconUrl: getIconUrl(order.asset),
      });
    });

    // Add fiat transactions
    fiatTransactions.forEach(tx => {
      result.push({
        id: `fiat-${tx.id}`,
        type: tx.type === 'DEPOSIT' ? 'deposit' : 'withdrawal',
        asset: 'USD',
        amount: tx.amount,
        value: tx.amount,
        status: tx.status as 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED',
        date: new Date(tx.createdAt),
        reference: tx.reference,
      });
    });

    // Sort by date descending
    result.sort((a, b) => b.date.getTime() - a.date.getTime());
    return result;
  }, [orders, fiatTransactions, getIconUrl]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let result = [...allTransactions];

    // Filter by tab
    if (activeTab === 'trades') {
      result = result.filter(t => t.type === 'trade');
    } else if (activeTab === 'deposits') {
      result = result.filter(t => t.type === 'deposit');
    } else if (activeTab === 'withdrawals') {
      result = result.filter(t => t.type === 'withdrawal');
    }

    return result;
  }, [allTransactions, activeTab]);

  // Count by type
  const counts = useMemo(() => ({
    all: allTransactions.length,
    trades: allTransactions.filter(t => t.type === 'trade').length,
    deposits: allTransactions.filter(t => t.type === 'deposit').length,
    withdrawals: allTransactions.filter(t => t.type === 'withdrawal').length,
  }), [allTransactions]);

  // Group transactions by date for mobile
  const groupedByDate = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    
    filteredTransactions.forEach(tx => {
      const d = new Date(tx.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let key: string;
      if (d.toDateString() === today.toDateString()) {
        key = 'Today';
      } else if (d.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday';
      } else if (d.getFullYear() === today.getFullYear()) {
        key = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      } else {
        key = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });
    
    return groups;
  }, [filteredTransactions]);

  const isLoadingAll = isLoadingOrders || loadingFiat;

  if (pageLoading) {
    return (
      <>
        <Head><title>Transactions - InTuition Exchange</title></Head>
        <DashboardLayout activeKey="transactions">
          <Skeleton active paragraph={{ rows: 12 }} />
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Transactions - InTuition Exchange</title>
        <meta name="description" content="View your transaction history" />
      </Head>

      <DashboardLayout activeKey="transactions">
        {/* Header with filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: token.marginLG }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? token.marginMD : token.marginLG,
          }}>
            {/* Title area */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: token.marginSM,
            }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: token.borderRadius,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 18,
                }}
              >
                <HistoryOutlined />
              </div>
              <div>
                <h1 style={{ 
                  fontSize: isMobile ? token.fontSizeHeading4 : token.fontSizeHeading3, 
                  fontWeight: fontWeights.bold,
                  margin: 0,
                  color: token.colorText,
                }}>
                  Transactions
                </h1>
                <p style={{
                  fontSize: token.fontSizeSM,
                  color: token.colorTextSecondary,
                  margin: 0,
                }}>
                  {counts.all} total transactions
                </p>
              </div>
            </div>

            {/* Filter pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: token.marginXS,
                marginLeft: isMobile ? 0 : 'auto',
              }}
            >
              <FilterPill
                active={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
                icon={<FilterOutlined />}
                count={counts.all}
                compact={useCompactFilters}
              >
                All
              </FilterPill>
              <FilterPill
                active={activeTab === 'trades'}
                onClick={() => setActiveTab('trades')}
                icon={<SwapOutlined />}
                count={counts.trades}
                compact={useCompactFilters}
              >
                Trades
              </FilterPill>
              <FilterPill
                active={activeTab === 'deposits'}
                onClick={() => setActiveTab('deposits')}
                icon={<ArrowDownOutlined />}
                count={counts.deposits}
                compact={useCompactFilters}
              >
                Deposits
              </FilterPill>
              <FilterPill
                active={activeTab === 'withdrawals'}
                onClick={() => setActiveTab('withdrawals')}
                icon={<ArrowUpOutlined />}
                count={counts.withdrawals}
                compact={useCompactFilters}
              >
                Withdrawals
              </FilterPill>
            </div>
          </div>
        </motion.div>

        {/* Transactions List */}
        {isLoadingAll ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: token.marginSM 
          }}>
            {[...Array(6)].map((_, i) => (
              <Skeleton.Button 
                key={i} 
                active 
                block 
                style={{ height: isMobile ? 80 : 60, borderRadius: token.borderRadiusLG }} 
              />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: token.paddingXL * 2,
              textAlign: 'center',
              background: isDark ? 'rgba(255,255,255,0.02)' : token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(102, 126, 234, 0.1)'}`,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: token.marginLG,
              }}
            >
              <HistoryOutlined style={{ fontSize: 32, color: '#667eea' }} />
            </div>
            <Empty
              description={
                activeTab !== 'all'
                  ? `No ${activeTab} yet`
                  : 'No transactions yet'
              }
            />
            {activeTab === 'all' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/trade')}
                style={{
                  marginTop: token.marginLG,
                  padding: `${token.paddingSM}px ${token.paddingLG}px`,
                  borderRadius: 50,
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontWeight: fontWeights.semibold,
                  fontSize: token.fontSize,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: token.marginXS,
                }}
              >
                <SwapOutlined />
                Start Trading
              </motion.button>
            )}
          </motion.div>
        ) : (
          <>
            {/* Mobile: Card view grouped by date */}
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: token.marginLG }}>
                {Object.entries(groupedByDate).map(([date, transactions]) => (
                  <div key={date}>
                    <div
                      style={{
                        fontSize: token.fontSizeSM,
                        fontWeight: fontWeights.semibold,
                        color: token.colorTextSecondary,
                        marginBottom: token.marginSM,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      {date}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: token.marginSM }}>
                      <AnimatePresence mode="popLayout">
                        {transactions.map((tx) => (
                          <TransactionCard
                            key={tx.id}
                            transaction={tx}
                            compact={false}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop: Table view */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.02)' : '#fff',
                  borderRadius: token.borderRadiusLG,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(102, 126, 234, 0.1)'}`,
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr 1fr 1fr 100px',
                    gap: token.marginMD,
                    padding: `${token.paddingSM}px ${token.paddingMD}px`,
                    borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(102, 126, 234, 0.1)'}`,
                    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(102, 126, 234, 0.03)',
                  }}
                >
                  <div style={{ fontSize: 11, color: token.colorTextTertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Transaction
                  </div>
                  <div style={{ fontSize: 11, color: token.colorTextTertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Amount
                  </div>
                  <div style={{ fontSize: 11, color: token.colorTextTertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Value
                  </div>
                  <div style={{ fontSize: 11, color: token.colorTextTertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Status
                  </div>
                  <div style={{ fontSize: 11, color: token.colorTextTertiary, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>
                    Net
                  </div>
                </div>

                {/* Rows */}
                <AnimatePresence mode="popLayout">
                  {filteredTransactions.map((tx) => (
                    <TransactionRow
                      key={tx.id}
                      transaction={tx}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}

        {/* Summary stats at bottom on mobile */}
        {!isLoadingAll && filteredTransactions.length > 0 && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: token.marginXL,
              padding: token.paddingLG,
              background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
              borderRadius: token.borderRadiusLG,
              border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.15)'}`,
            }}
          >
            <div style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary, marginBottom: token.marginXS }}>
              Summary
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: token.marginMD }}>
              <div>
                <div style={{ fontSize: token.fontSizeSM, color: token.colorTextTertiary }}>Total In</div>
                <div style={{ fontSize: token.fontSizeLG, fontWeight: fontWeights.bold, color: '#16C47F' }}>
                  +${filteredTransactions
                    .filter(t => t.type === 'deposit' || (t.type === 'trade' && t.side === 'BUY'))
                    .reduce((sum, t) => sum + t.value, 0)
                    .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div style={{ fontSize: token.fontSizeSM, color: token.colorTextTertiary }}>Total Out</div>
                <div style={{ fontSize: token.fontSizeLG, fontWeight: fontWeights.bold, color: '#fc6f03' }}>
                  -${filteredTransactions
                    .filter(t => t.type === 'withdrawal' || (t.type === 'trade' && t.side === 'SELL'))
                    .reduce((sum, t) => sum + t.value, 0)
                    .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </DashboardLayout>
    </>
  );
}
