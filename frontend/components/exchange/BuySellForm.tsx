'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { theme, Button, Modal, message, Input, Empty, Grid } from 'antd';
import { 
  SwapOutlined, 
  InfoCircleOutlined, 
  SearchOutlined,
  DownOutlined,
  CheckOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'motion/react';
import { fontWeights } from '@/theme/themeConfig';
import { useThemeMode } from '@/context/ThemeContext';
import { useExchange } from '@/context/ExchangeContext';
import { useAuth } from '@/context/AuthContext';
import { InternalOrder } from '@/services/api/coinbase';
import OrderStatusModal from './OrderStatusModal';

const { useToken } = theme;
const { useBreakpoint } = Grid;

type OrderSide = 'BUY' | 'SELL';

// Styled input component - defined outside to prevent re-creation on every render
interface StyledInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  disabled?: boolean;
  token: any;
}

const StyledInput: React.FC<StyledInputProps> = ({
  value,
  onChange,
  placeholder,
  suffix,
  prefix,
  disabled,
  token,
}) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${token.colorBorder}`,
    borderRadius: token.borderRadius,
    overflow: 'hidden',
    backgroundColor: token.colorBgLayout,
    transition: 'border-color 0.2s',
  }}>
    {prefix && (
      <span style={{
        paddingLeft: token.paddingMD,
        color: token.colorText,
        fontSize: token.fontSizeXL,
        fontWeight: fontWeights.semibold,
      }}>
        {prefix}
      </span>
    )}
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        flex: 1,
        padding: `${token.paddingMD}px ${prefix ? token.paddingXS : token.paddingMD}px`,
        border: 'none',
        outline: 'none',
        fontSize: token.fontSizeXL,
        fontWeight: fontWeights.semibold,
        color: token.colorText,
        backgroundColor: 'transparent',
        minWidth: 0,
      }}
    />
    {suffix && (
      <div style={{
        padding: `${token.paddingSM}px ${token.paddingMD}px`,
        color: token.colorTextSecondary,
        fontSize: token.fontSizeSM,
        fontWeight: fontWeights.semibold,
      }}>
        {suffix}
      </div>
    )}
  </div>
);

// Percentage chips component - defined outside to prevent re-creation on every render
interface PercentageChipsProps {
  onPercentageClick: (percent: number) => void;
  token: any;
}

const PercentageChips: React.FC<PercentageChipsProps> = ({ onPercentageClick, token }) => (
  <div style={{
    display: 'flex',
    gap: token.marginXS,
    marginTop: token.marginSM,
  }}>
    {[25, 50, 75, 100].map((percent) => (
      <div
        key={percent}
        onClick={() => onPercentageClick(percent)}
        style={{
          flex: 1,
          padding: `${token.paddingXS}px 0`,
          textAlign: 'center',
          fontSize: token.fontSizeSM,
          fontWeight: fontWeights.medium,
          color: token.colorTextSecondary,
          background: token.colorBgLayout,
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusSM,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        {percent}%
      </div>
    ))}
  </div>
);

interface TradingPair {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  quote: string;
  baseCurrency: string;
  quoteCurrency: string;
  iconUrl: string;
  isCollegeCoin?: boolean;
}

interface BuySellFormProps {
  onTrade?: (side: OrderSide, asset: string, amount: number, total: number) => Promise<void>;
  isLoading?: boolean;
  initialAsset?: string;
}

const BuySellForm: React.FC<BuySellFormProps> = ({
  onTrade,
  isLoading = false,
  initialAsset,
}) => {
  const { token } = useToken();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const { user } = useAuth();
  const isDark = mode === 'dark';
  const isLearnerMode = user?.appMode === 'LEARNER';
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isMobile = mounted ? !screens.md : true;
  
  const { 
    pairs, 
    isLoadingPairs, 
    getBalance, 
    isTrading,
    refreshBalances,
    refreshOrders,
    appMode,
    executeTrade,
  } = useExchange();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get only USD pairs for simplicity
  // In learner mode, include college coins as well
  const usdPairs = useMemo(() => {
    return pairs
      .filter(p => {
        // Always include USD pairs
        if (p.quote === 'USD') {
          // In learner mode, include all USD pairs (both regular and college coins)
          // In investor mode, exclude college coins
          if (isLearnerMode) return true;
          return !(p as TradingPair).isCollegeCoin;
        }
        return false;
      })
      .sort((a, b) => {
        const aIsCollege = (a as TradingPair).isCollegeCoin ? 1 : 0;
        const bIsCollege = (b as TradingPair).isCollegeCoin ? 1 : 0;
        
        // In learner mode: college coins FIRST, then by volume
        // In investor mode: college coins hidden anyway, just sort by volume
        if (isLearnerMode && aIsCollege !== bIsCollege) {
          return bIsCollege - aIsCollege; // College coins first (1 > 0)
        }
        
        const aVol = (a as any)._usdVolume || 0;
        const bVol = (b as any)._usdVolume || 0;
        return bVol - aVol;
      });
  }, [pairs, isLearnerMode]);
  
  const [side, setSide] = useState<OrderSide>('BUY');
  const [selectedAsset, setSelectedAsset] = useState<string>(initialAsset || 'BTC');
  const [amount, setAmount] = useState<string>(''); // Token amount
  const [cashAmount, setCashAmount] = useState<string>(''); // USD amount
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTokenPicker, setShowTokenPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusModalVisible, setOrderStatusModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<InternalOrder | null>(null);
  
  // Update selected asset when initialAsset prop changes (e.g., from URL query)
  // Or when in learner mode, default to first college coin once pairs load
  useEffect(() => {
    if (initialAsset && initialAsset !== selectedAsset) {
      setSelectedAsset(initialAsset);
    } else if (!initialAsset && isLearnerMode && pairs.length > 0) {
      // Default to first college coin in learner mode
      const firstCollegeCoin = pairs.find(p => (p as TradingPair).isCollegeCoin && p.quote === 'USD');
      if (firstCollegeCoin && selectedAsset === 'BTC') {
        setSelectedAsset(firstCollegeCoin.baseCurrency);
      }
    }
  }, [initialAsset, isLearnerMode, pairs]);
  
  const loading = isLoading || isTrading || isSubmitting;
  const isBuy = side === 'BUY';
  
  // Get selected pair data
  const selectedPair = useMemo(() => {
    return usdPairs.find(p => p.baseCurrency === selectedAsset) || null;
  }, [usdPairs, selectedAsset]);
  
  const price = selectedPair?.price || 0;
  
  // Balances
  const cashBalance = getBalance('USD');
  const tokenBalance = getBalance(selectedAsset);
  
  // Parsed amounts
  const amountNum = parseFloat(amount) || 0;
  const cashAmountNum = parseFloat(cashAmount) || 0;
  
  // Filter tokens for picker
  const filteredTokens = useMemo(() => {
    if (!searchQuery) return usdPairs;
    const q = searchQuery.toLowerCase();
    return usdPairs.filter(
      p => p.baseCurrency.toLowerCase().includes(q) || 
           p.name.toLowerCase().includes(q)
    );
  }, [usdPairs, searchQuery]);
  
  // Reset form when asset changes
  useEffect(() => {
    setAmount('');
    setCashAmount('');
    setShowConfirm(false);
  }, [selectedAsset]);
  
  // Helper to restrict USD input to 2 decimal places
  const restrictCashDecimals = (value: string): string => {
    // Allow empty string
    if (!value) return value;
    // Check if it has more than 2 decimal places
    const parts = value.split('.');
    if (parts.length === 2 && parts[1].length > 2) {
      return `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
    return value;
  };

  // Calculate token amount from cash (BUY)
  const handleCashAmountChange = (value: string) => {
    const restricted = restrictCashDecimals(value);
    setCashAmount(restricted);
    const num = parseFloat(restricted) || 0;
    if (num > 0 && price > 0) {
      setAmount((num / price).toFixed(8));
    } else {
      setAmount('');
    }
  };
  
  // Calculate cash amount from token (SELL)
  const handleTokenAmountChange = (value: string) => {
    setAmount(value);
    const num = parseFloat(value) || 0;
    if (num > 0 && price > 0) {
      setCashAmount((num * price).toFixed(2));
    } else {
      setCashAmount('');
    }
  };
  
  // Percentage buttons
  const handlePercentage = (percent: number) => {
    if (price <= 0) return;
    
    if (isBuy) {
      // For BUY: percentage of USD balance
      const maxCash = percent === 100 
        ? Math.floor(cashBalance * 100) / 100 
        : cashBalance * (percent / 100);
      setCashAmount(maxCash.toFixed(2));
      if (price > 0) {
        setAmount((maxCash / price).toFixed(8));
      }
    } else {
      // For SELL: percentage of token balance
      const maxAmount = tokenBalance * (percent / 100);
      setAmount(maxAmount.toFixed(8));
      if (price > 0) {
        setCashAmount((maxAmount * price).toFixed(2));
      }
    }
  };
  
  // Handle trade submission
  const handleSubmit = async () => {
    if (!amountNum || !cashAmountNum || !selectedPair) return;
    
    // Validate balance
    if (isBuy && cashAmountNum > cashBalance + 0.01) {
      message.error(`Insufficient USD balance. You need $${cashAmountNum.toFixed(2)} but only have $${cashBalance.toFixed(2)}`);
      setShowConfirm(false);
      return;
    }
    
    if (!isBuy && amountNum > tokenBalance) {
      message.error(`Insufficient ${selectedAsset} balance. You want to sell ${amountNum.toFixed(8)} but only have ${tokenBalance.toFixed(8)}`);
      setShowConfirm(false);
      return;
    }
    
    setShowConfirm(false);
    setIsSubmitting(true);
    
    // Create pending order for immediate feedback
    const productId = `${selectedAsset}-USD`;
    const pendingOrder: InternalOrder = {
      id: `pending-${Date.now()}`,
      transactionId: '',
      productId,
      asset: selectedAsset,
      quote: 'USD',
      side,
      requestedAmount: isBuy ? cashAmountNum : amountNum,
      filledAmount: 0,
      price,
      totalValue: cashAmountNum,
      platformFee: fee,
      exchangeFee: 0,
      status: 'PENDING',
      coinbaseOrderId: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    
    // Show modal immediately with pending status
    setCurrentOrder(pendingOrder);
    setOrderStatusModalVisible(true);
    
    try {
      if (onTrade) {
        await onTrade(side, selectedAsset, amountNum, cashAmountNum);
        // Update order to completed
        setCurrentOrder({
          ...pendingOrder,
          status: 'COMPLETED',
          filledAmount: amountNum,
          completedAt: new Date().toISOString(),
        });
      } else {
        // Use executeTrade from context - handles both learner and investor mode
        // Pass productId directly to avoid race condition with async state updates
        const result = await executeTrade(side, amountNum, cashAmountNum, productId);
        
        if (result.success && result.order) {
          // Update with actual order data
          setCurrentOrder(result.order);
          // Refresh balances and orders
          await Promise.all([refreshBalances(), refreshOrders()]);
          // Clear form on success
          setAmount('');
          setCashAmount('');
          
          // Handle simulated failure in learner mode
          if (result.isSimulatedFailure) {
            message.warning('Simulated trade failure - this is normal in learner mode to practice handling failed orders.');
          }
        } else {
          // Update order to failed
          setCurrentOrder({
            ...pendingOrder,
            status: 'FAILED',
          });
          
          // Show message for simulated failure
          if (result.isSimulatedFailure) {
            message.warning('Simulated trade failure - this is normal in learner mode to practice handling failed orders.');
          }
        }
      }
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Trade failed:', error);
      }
      // Update order to failed
      setCurrentOrder({
        ...pendingOrder,
        status: 'FAILED',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fee calculation (0.5%)
  const fee = cashAmountNum * 0.005;
  
  // What user receives
  const receiveAmount = isBuy 
    ? amountNum 
    : cashAmountNum - fee;

  return (
    <div style={{
      backgroundColor: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      padding: token.paddingLG,
      paddingBottom: isMobile ? token.paddingMD : token.paddingLG,
      border: `1px solid ${token.colorBorderSecondary}`,
      maxWidth: 420,
      width: '100%',
    }}>
      {/* Buy/Sell Toggle - Tab Style */}
      <div style={{
        display: 'flex',
        marginBottom: token.marginLG,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}>
        {(['BUY', 'SELL'] as OrderSide[]).map((s) => {
          const isActive = side === s;
          const activeColor = s === 'BUY' ? token.colorSuccess : token.colorError;
          
          return (
            <motion.div
              key={s}
              onClick={() => setSide(s)}
              whileTap={{ scale: 0.98 }}
              style={{
                flex: 1,
                padding: `${token.paddingSM}px ${token.paddingMD}px`,
                paddingBottom: token.paddingMD,
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{
                fontSize: token.fontSizeLG,
                fontWeight: isActive ? fontWeights.bold : fontWeights.medium,
                color: isActive ? activeColor : token.colorTextTertiary,
                transition: 'color 0.2s ease',
              }}>
                {s === 'BUY' ? 'Buy' : 'Sell'}
              </span>
              {/* Active indicator line */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: token.paddingMD,
                    right: token.paddingMD,
                    height: 3,
                    borderRadius: 2,
                    background: activeColor,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Token Selector */}
      <div style={{ marginBottom: token.marginMD }}>
        <div style={{
          fontSize: token.fontSizeSM,
          color: token.colorTextSecondary,
          marginBottom: token.marginXS,
        }}>
          {isBuy ? 'You want to buy' : 'You want to sell'}
        </div>
        <motion.div
          whileHover={{ borderColor: token.colorPrimary }}
          onClick={() => setShowTokenPicker(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: token.marginSM,
            padding: token.paddingMD,
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadius,
            cursor: 'pointer',
            background: token.colorBgLayout,
            transition: 'border-color 0.2s',
          }}
        >
          {selectedPair ? (
            <>
              <img
                src={selectedPair.iconUrl}
                alt={selectedPair.baseCurrency}
                width={36}
                height={36}
                style={{ borderRadius: '50%' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedPair.baseCurrency}&background=667eea&color=fff&size=72`;
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: fontWeights.semibold,
                  color: token.colorText,
                }}>
                  {selectedPair.baseCurrency}
                </div>
                <div style={{
                  fontSize: token.fontSizeSM,
                  color: token.colorTextTertiary,
                }}>
                  {selectedPair.name}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: token.fontSizeSM,
                  color: token.colorText,
                  fontWeight: fontWeights.medium,
                }}>
                  ${price.toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: price < 1 ? 6 : 2 
                  })}
                </div>
                <div style={{
                  fontSize: 11,
                  color: selectedPair.change >= 0 ? token.colorSuccess : token.colorError,
                }}>
                  {selectedPair.change >= 0 ? '+' : ''}{selectedPair.change.toFixed(2)}%
                </div>
              </div>
            </>
          ) : (
            <span style={{ color: token.colorTextTertiary }}>Select token</span>
          )}
          <DownOutlined style={{ color: token.colorTextTertiary, fontSize: 12 }} />
        </motion.div>
      </div>
      
      {/* Available Balance */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: token.marginSM,
        padding: `${token.paddingSM}px ${token.paddingMD}px`,
        background: token.colorBgLayout,
        borderRadius: token.borderRadiusSM,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: token.marginXS,
          fontSize: token.fontSizeSM,
          color: token.colorTextSecondary,
        }}>
          <WalletOutlined />
          <span>Available</span>
        </div>
        <span style={{
          fontSize: token.fontSizeSM,
          fontWeight: fontWeights.semibold,
          color: token.colorText,
        }}>
          {isBuy 
            ? `$${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
            : `${tokenBalance.toFixed(tokenBalance < 0.0001 ? 8 : 4)} ${selectedAsset}`
          }
        </span>
      </div>
      
      {/* Amount Inputs */}
      <div style={{ marginBottom: token.marginLG }}>
        {isBuy ? (
          <>
            {/* Cash Amount (Primary input for BUY) */}
            <div style={{ marginBottom: token.marginMD }}>
              <div style={{
                fontSize: token.fontSizeSM,
                color: token.colorTextSecondary,
                marginBottom: token.marginXS,
              }}>
                You pay
              </div>
              <StyledInput
                value={cashAmount}
                onChange={handleCashAmountChange}
                placeholder="0.00"
                prefix="$"
                suffix="USD"
                token={token}
              />
              {/* Percentage chips right after primary input */}
              <PercentageChips onPercentageClick={handlePercentage} token={token} />
            </div>
            
            {/* Swap Icon */}
            <div style={{ textAlign: 'center', margin: `${token.marginSM}px 0` }}>
              <SwapOutlined 
                rotate={90}
                style={{ 
                  fontSize: 16, 
                  color: token.colorTextTertiary,
                  padding: token.paddingXS,
                  background: token.colorBgLayout,
                  borderRadius: '50%',
                }} 
              />
            </div>
            
            {/* Token Amount (Calculated for BUY) */}
            <div>
              <div style={{
                fontSize: token.fontSizeSM,
                color: token.colorTextSecondary,
                marginBottom: token.marginXS,
              }}>
                You receive (estimate)
              </div>
              <StyledInput
                value={amount}
                onChange={(v) => {
                  setAmount(v);
                  const num = parseFloat(v) || 0;
                  if (num > 0 && price > 0) {
                    setCashAmount((num * price).toFixed(2));
                  } else {
                    setCashAmount('');
                  }
                }}
                placeholder="0.00"
                suffix={selectedAsset}
                token={token}
              />
            </div>
          </>
        ) : (
          <>
            {/* Token Amount (Primary input for SELL) */}
            <div style={{ marginBottom: token.marginMD }}>
              <div style={{
                fontSize: token.fontSizeSM,
                color: token.colorTextSecondary,
                marginBottom: token.marginXS,
              }}>
                You sell
              </div>
              <StyledInput
                value={amount}
                onChange={handleTokenAmountChange}
                placeholder="0.00"
                suffix={selectedAsset}
                token={token}
              />
              {/* Percentage chips right after primary input */}
              <PercentageChips onPercentageClick={handlePercentage} token={token} />
            </div>
            
            {/* Swap Icon */}
            <div style={{ textAlign: 'center', margin: `${token.marginSM}px 0` }}>
              <SwapOutlined 
                rotate={90}
                style={{ 
                  fontSize: 16, 
                  color: token.colorTextTertiary,
                  padding: token.paddingXS,
                  background: token.colorBgLayout,
                  borderRadius: '50%',
                }} 
              />
            </div>
            
            {/* Cash Amount (Calculated for SELL) */}
            <div>
              <div style={{
                fontSize: token.fontSizeSM,
                color: token.colorTextSecondary,
                marginBottom: token.marginXS,
              }}>
                You receive (estimate)
              </div>
              <StyledInput
                value={cashAmount}
                onChange={(v) => {
                  const restricted = restrictCashDecimals(v);
                  setCashAmount(restricted);
                  const num = parseFloat(restricted) || 0;
                  if (num > 0 && price > 0) {
                    setAmount((num / price).toFixed(8));
                  } else {
                    setAmount('');
                  }
                }}
                placeholder="0.00"
                prefix="$"
                suffix="USD"
                token={token}
              />
            </div>
          </>
        )}
      </div>
      
      {/* Insufficient Balance Warning */}
      <AnimatePresence>
        {(cashAmountNum > 0 || amountNum > 0) && (
          (isBuy && cashAmountNum > cashBalance + 0.01) || (!isBuy && amountNum > tokenBalance) ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginBottom: token.marginSM,
                padding: token.paddingSM,
                backgroundColor: token.colorErrorBg,
                borderRadius: token.borderRadiusSM,
                border: `1px solid ${token.colorErrorBorder}`,
                fontSize: token.fontSizeSM,
                color: token.colorError,
              }}
            >
              <InfoCircleOutlined style={{ marginRight: token.marginXS }} />
              Insufficient balance. {isBuy 
                ? cashBalance === 0 
                  ? `You don't have any USD to complete this trade`
                  : `You need $${cashAmountNum.toFixed(2)} but only have $${cashBalance.toFixed(2)}`
                : tokenBalance === 0
                  ? `You don't have any ${selectedAsset} to sell`
                  : `You want to sell ${amountNum.toFixed(8)} but only have ${tokenBalance.toFixed(8)}`
              }
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
      
      {/* Fee Info */}
      <AnimatePresence>
        {cashAmountNum > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginBottom: token.marginMD,
              padding: token.paddingMD,
              background: token.colorBgLayout,
              borderRadius: token.borderRadiusSM,
              fontSize: token.fontSizeSM,
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: token.marginXS,
              color: token.colorTextSecondary,
            }}>
              <span>Price</span>
              <span style={{ color: token.colorText }}>
                ${price.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: price < 1 ? 6 : 2 
                })}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: token.marginXS,
              color: token.colorTextSecondary,
            }}>
              <span>Fee (0.5%)</span>
              <span style={{ color: token.colorText }}>
                ${fee.toFixed(2)}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              paddingTop: token.paddingSM,
              borderTop: `1px solid ${token.colorBorderSecondary}`,
            }}>
              <span style={{ color: token.colorTextSecondary }}>
                You {isBuy ? 'receive' : 'get'}
              </span>
              <span style={{ 
                color: isBuy ? token.colorSuccess : token.colorText, 
                fontWeight: fontWeights.bold 
              }}>
                {isBuy 
                  ? `${receiveAmount.toFixed(6)} ${selectedAsset}`
                  : `$${receiveAmount.toFixed(2)}`
                }
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Submit Button - Sticky on mobile */}
      {isMobile ? (
        <>
          {/* Sticky button container */}
          <div style={{
            position: 'fixed',
            bottom: 70, // Above navbar
            left: 0,
            right: 0,
            padding: `${token.paddingSM}px ${token.paddingMD}px`,
            paddingBottom: token.paddingMD,
            background: `linear-gradient(to top, ${token.colorBgContainer} 70%, transparent)`,
            zIndex: 100,
          }}>
            <Button
              type="primary"
              size="large"
              block
              loading={loading}
              disabled={
                !selectedPair ||
                !cashAmountNum || 
                cashAmountNum <= 0 || 
                !amountNum || 
                amountNum <= 0 || 
                price <= 0 ||
                (isBuy && cashAmountNum > cashBalance + 0.01) ||
                (!isBuy && amountNum > tokenBalance)
              }
              onClick={() => setShowConfirm(true)}
              style={{
                height: 56,
                borderRadius: token.borderRadius,
                fontWeight: fontWeights.bold,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: token.fontSizeLG,
                background: isBuy ? token.colorSuccess : token.colorError,
                border: 'none',
                color: '#ffffff',
              }}
            >
              {isBuy ? 'Buy' : 'Sell'} {selectedAsset}
            </Button>
            <div style={{
              marginTop: token.marginXS,
              fontSize: 11,
              color: token.colorTextTertiary,
              textAlign: 'center',
              lineHeight: 1.5,
            }}>
              Market order • Executes at best available price
            </div>
          </div>
        </>
      ) : (
        <>
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            disabled={
              !selectedPair ||
              !cashAmountNum || 
              cashAmountNum <= 0 || 
              !amountNum || 
              amountNum <= 0 || 
              price <= 0 ||
              (isBuy && cashAmountNum > cashBalance + 0.01) ||
              (!isBuy && amountNum > tokenBalance)
            }
            onClick={() => setShowConfirm(true)}
            style={{
              height: 56,
              borderRadius: token.borderRadius,
              fontWeight: fontWeights.bold,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: token.fontSizeLG,
              background: isBuy ? token.colorSuccess : token.colorError,
              border: 'none',
              color: '#ffffff',
            }}
          >
            {isBuy ? 'Buy' : 'Sell'} {selectedAsset}
          </Button>
          
          {/* Market Order Info */}
          <div style={{
            marginTop: token.marginMD,
            fontSize: 11,
            color: token.colorTextTertiary,
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            Market order • Executes at best available price
          </div>
        </>
      )}
      
      {/* Token Picker Modal */}
      <Modal
        title={null}
        open={showTokenPicker}
        onCancel={() => {
          setShowTokenPicker(false);
          setSearchQuery('');
        }}
        footer={null}
        width={400}
        centered
        destroyOnClose={false}
        styles={{
          body: {
            borderRadius: token.borderRadiusLG,
            padding: 0,
            overflow: 'hidden',
            background: token.colorBgContainer,
          },
          mask: {
            backdropFilter: 'blur(4px)',
          },
        }}
      >
        <div style={{ padding: token.paddingLG }}>
          <div style={{
            fontSize: token.fontSizeHeading4,
            fontWeight: fontWeights.bold,
            marginBottom: token.marginMD,
            color: token.colorText,
          }}>
            Select Token
          </div>
          
          <Input
            prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
            placeholder="Search by name or symbol"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              borderRadius: 50,
              marginBottom: token.marginMD,
              background: token.colorBgLayout,
            }}
            size="large"
            allowClear
          />
          
          <div style={{
            maxHeight: 400,
            overflowY: 'auto',
            margin: `0 -${token.paddingLG}px`,
            padding: `0 ${token.paddingLG}px`,
          }}>
            {filteredTokens.length === 0 ? (
              <Empty description="No tokens found" />
            ) : (
              filteredTokens.map((pair) => {
                const isSelected = pair.baseCurrency === selectedAsset;
                const balance = getBalance(pair.baseCurrency);
                
                return (
                  <div
                    key={pair.baseCurrency}
                    onClick={() => {
                      setSelectedAsset(pair.baseCurrency);
                      setShowTokenPicker(false);
                      setSearchQuery('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: token.marginSM,
                      padding: `${token.paddingSM}px ${token.paddingMD}px`,
                      margin: `0 -${token.paddingMD}px`,
                      cursor: 'pointer',
                      borderRadius: token.borderRadiusSM,
                      backgroundColor: isSelected 
                        ? token.colorPrimaryBg
                        : 'transparent',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = token.colorBgLayout;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <img
                      src={pair.iconUrl}
                      alt={pair.baseCurrency}
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${pair.baseCurrency}&background=667eea&color=fff&size=80`;
                      }}
                    />
<div style={{ flex: 1 }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                }}>
                                  <span style={{
                                    fontWeight: fontWeights.semibold,
                                    color: token.colorText,
                                    fontSize: token.fontSize,
                                  }}>
                                    {pair.baseCurrency}
                                  </span>
                                  {(pair as TradingPair).isCollegeCoin && (
                                    <span style={{
                                      fontSize: 10,
                                      color: '#fff',
                                      background: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
                                      padding: '2px 6px',
                                      borderRadius: 4,
                                      fontWeight: fontWeights.medium,
                                    }}>
                                      College
                                    </span>
                                  )}
                                </div>
                                <div style={{
                                  fontSize: token.fontSizeSM,
                                  color: token.colorTextSecondary,
                                }}>
                                  {pair.name}
                                </div>
                              </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: token.fontSizeSM,
                        color: token.colorText,
                        fontWeight: fontWeights.medium,
                      }}>
                        ${pair.price.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: pair.price < 1 ? 6 : 2 
                        })}
                      </div>
                      {balance > 0 && (
                        <div style={{
                          fontSize: 11,
                          color: token.colorTextTertiary,
                        }}>
                          {balance.toFixed(balance < 0.0001 ? 8 : 4)} available
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <CheckOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>
      
      {/* Confirmation Modal */}
      <Modal
        title={null}
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        footer={null}
        centered
        width={380}
        styles={{
          body: {
            borderRadius: token.borderRadiusLG,
            padding: token.paddingLG,
            background: token.colorBgContainer,
          },
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: token.marginLG }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: isBuy 
              ? token.colorSuccess
              : token.colorError,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            marginBottom: token.marginMD,
          }}>
            {selectedPair && (
              <img
                src={selectedPair.iconUrl}
                alt={selectedAsset}
                width={40}
                height={40}
                style={{ borderRadius: '50%' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedAsset}&background=667eea&color=fff&size=80`;
                }}
              />
            )}
          </div>
          <div style={{
            fontSize: token.fontSizeHeading4,
            fontWeight: fontWeights.bold,
            color: token.colorText,
            marginBottom: token.marginXS,
          }}>
            Confirm {side}
          </div>
          <div style={{
            fontSize: token.fontSizeSM,
            color: token.colorTextSecondary,
          }}>
            Review your order details
          </div>
        </div>
        
        <div style={{
          background: token.colorBgLayout,
          borderRadius: token.borderRadiusSM,
          padding: token.paddingMD,
          marginBottom: token.marginLG,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: token.marginSM,
          }}>
            <span style={{ color: token.colorTextSecondary }}>Type</span>
            <span style={{ 
              color: isBuy ? token.colorSuccess : token.colorError,
              fontWeight: fontWeights.bold,
            }}>
              Market {side}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: token.marginSM,
          }}>
            <span style={{ color: token.colorTextSecondary }}>Amount</span>
            <span style={{ color: token.colorText, fontWeight: fontWeights.semibold }}>
              {amountNum.toFixed(6)} {selectedAsset}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: token.marginSM,
          }}>
            <span style={{ color: token.colorTextSecondary }}>Price</span>
            <span style={{ color: token.colorText }}>
              ${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: token.marginSM,
          }}>
            <span style={{ color: token.colorTextSecondary }}>Fee (0.5%)</span>
            <span style={{ color: token.colorText }}>
              ${fee.toFixed(2)}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: token.paddingSM,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
          }}>
            <span style={{ color: token.colorTextSecondary }}>
              You {isBuy ? 'pay' : 'receive'}
            </span>
            <span style={{ color: token.colorText, fontWeight: fontWeights.bold }}>
              {isBuy 
                ? `$${cashAmountNum.toFixed(2)}`
                : `$${receiveAmount.toFixed(2)}`
              }
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: token.marginSM }}>
          <Button
            size="large"
            onClick={() => setShowConfirm(false)}
            style={{
              flex: 1,
              height: 48,
              borderRadius: token.borderRadius,
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            loading={loading}
            style={{
              flex: 1,
              height: 48,
              borderRadius: token.borderRadius,
              background: isBuy ? token.colorSuccess : token.colorError,
              border: 'none',
            }}
          >
            Confirm {side}
          </Button>
        </div>
      </Modal>
      
      {/* Order Status Modal (Bottom Sheet on mobile) */}
      <OrderStatusModal
        visible={orderStatusModalVisible}
        order={currentOrder}
        onClose={() => {
          setOrderStatusModalVisible(false);
          setCurrentOrder(null);
        }}
        onStatusUpdate={(updatedOrder) => {
          setCurrentOrder(updatedOrder);
        }}
      />
    </div>
  );
};

export default BuySellForm;

