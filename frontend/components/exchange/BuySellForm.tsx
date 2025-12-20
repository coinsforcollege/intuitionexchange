'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { theme, Button, Modal, Drawer, message, Input, Empty, Grid } from 'antd';
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

// Percentage chips component - minimal style
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
      <motion.div
        key={percent}
        onClick={() => onPercentageClick(percent)}
        whileTap={{ scale: 0.95 }}
        style={{
          flex: 1,
          padding: `6px 0`,
          fontSize: 12,
          fontWeight: fontWeights.semibold,
          color: token.colorPrimary,
          background: token.colorPrimaryBg,
          border: `1px solid ${token.colorPrimaryBorder}`,
          borderRadius: token.borderRadius,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          textAlign: 'center',
        }}
      >
        {percent === 100 ? 'MAX' : `${percent}%`}
      </motion.div>
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
  const [isSimulatedFailure, setIsSimulatedFailure] = useState(false);
  
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
    setIsSimulatedFailure(false); // Reset simulated failure flag
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
          
          // Handle simulated failure in learner mode - modal will show educational content
          if (result.isSimulatedFailure) {
            setIsSimulatedFailure(true);
          }
        } else {
          // Update order to failed
          setCurrentOrder({
            ...pendingOrder,
            status: 'FAILED',
          });
          
          // Track simulated failure for modal display
          if (result.isSimulatedFailure) {
            setIsSimulatedFailure(true);
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

  // State for fee details expansion
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  
  return (
    <div style={{
      backgroundColor: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      padding: isMobile ? token.paddingMD : token.paddingLG,
      maxWidth: 420,
      width: '100%',
    }}>
      {/* Buy/Sell Toggle - Tab style with underline */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        marginBottom: token.marginMD,
      }}>
        {(['BUY', 'SELL'] as OrderSide[]).map((s) => {
          const isActive = side === s;
          
          return (
            <div
              key={s}
              onClick={() => setSide(s)}
              style={{
                flex: 1,
                padding: `${token.paddingSM}px ${token.paddingMD}px`,
                cursor: 'pointer',
                fontSize: token.fontSize,
                fontWeight: isActive ? fontWeights.bold : fontWeights.medium,
                color: isActive ? token.colorText : token.colorTextTertiary,
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {s === 'BUY' ? 'Buy' : 'Sell'}
              {isActive && (
                <motion.div
                  layoutId="buySellIndicator"
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: '20%',
                    right: '20%',
                    height: 2,
                    background: token.colorPrimary,
                    borderRadius: 1,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Token Selector - 3D Claymorphic style */}
      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowTokenPicker(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: token.marginSM,
          padding: `${token.paddingSM}px ${token.paddingMD}px`,
          marginBottom: token.marginMD,
          cursor: 'pointer',
          borderRadius: 16,
          // Claymorphic gradient background
          background: isDark
            ? `linear-gradient(145deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)`
            : `linear-gradient(145deg, rgba(139, 92, 246, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)`,
          // 3D claymorphic shadows
          boxShadow: isDark
            ? `
              4px 4px 12px rgba(0,0,0,0.4),
              -2px -2px 8px rgba(139, 92, 246, 0.15),
              inset 2px 2px 4px rgba(255,255,255,0.05),
              inset -2px -2px 4px rgba(0,0,0,0.2)
            `
            : `
              4px 4px 12px rgba(0,0,0,0.08),
              -2px -2px 8px rgba(255,255,255,0.9),
              inset 2px 2px 4px rgba(255,255,255,0.5),
              inset -2px -2px 4px rgba(0,0,0,0.03)
            `,
          border: isDark 
            ? '1px solid rgba(139, 92, 246, 0.2)' 
            : '1px solid rgba(139, 92, 246, 0.15)',
        }}
      >
        {selectedPair ? (
          <>
            <img
              src={selectedPair.iconUrl}
              alt={selectedPair.baseCurrency}
              width={36}
              height={36}
              style={{ 
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${selectedPair.baseCurrency}&background=667eea&color=fff&size=72`;
              }}
            />
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: fontWeights.bold, color: token.colorText, fontSize: token.fontSizeLG }}>
                {selectedPair.baseCurrency}
              </span>
              <span style={{ color: token.colorTextTertiary, marginLeft: token.marginXS, fontSize: token.fontSizeSM }}>
                {selectedPair.name}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: token.fontSizeSM, color: token.colorText, fontWeight: fontWeights.medium }}>
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: price < 1 ? 4 : 2 })}
              </div>
            </div>
            <DownOutlined style={{ color: token.colorPrimary, fontSize: 12 }} />
          </>
        ) : (
          <>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${token.colorPrimary}40, ${token.colorPrimary}20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isDark 
                ? 'inset 1px 1px 2px rgba(255,255,255,0.1), inset -1px -1px 2px rgba(0,0,0,0.2)'
                : 'inset 1px 1px 2px rgba(255,255,255,0.5), inset -1px -1px 2px rgba(0,0,0,0.05)',
            }}>
              <span style={{ fontSize: 18 }}>🪙</span>
            </div>
            <span style={{ color: token.colorText, flex: 1, fontWeight: fontWeights.semibold }}>
              Select token
            </span>
            <DownOutlined style={{ color: token.colorPrimary, fontSize: 12 }} />
          </>
        )}
      </motion.div>
      
      {/* Amount Section */}
      <div style={{ marginBottom: token.marginMD }}>
        {/* Primary input (You pay / You sell) */}
        <div style={{ marginBottom: token.marginSM }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}>
            <span style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
              {isBuy ? 'You pay' : 'You sell'}
            </span>
            <span 
              onClick={() => handlePercentage(100)}
              style={{ 
                fontSize: 12, 
                color: token.colorPrimary, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <WalletOutlined style={{ fontSize: 11 }} />
              {isBuy 
                ? `$${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : `${tokenBalance.toFixed(tokenBalance < 1 ? 4 : 2)} ${selectedAsset}`
              }
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: token.colorBgLayout,
            borderRadius: token.borderRadius,
            padding: `${token.paddingMD}px`,
          }}>
            <input
              type="number"
              value={isBuy ? cashAmount : amount}
              onChange={(e) => isBuy ? handleCashAmountChange(e.target.value) : handleTokenAmountChange(e.target.value)}
              placeholder="0.00"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 24,
                fontWeight: fontWeights.bold,
                color: token.colorText,
                backgroundColor: 'transparent',
                minWidth: 0,
              }}
            />
            <span style={{ color: token.colorTextSecondary, fontSize: token.fontSize, fontWeight: fontWeights.semibold }}>
              {isBuy ? 'USD' : selectedAsset}
            </span>
          </div>
          
          {/* Percentage chips */}
          <PercentageChips onPercentageClick={handlePercentage} token={token} />
        </div>
        
        {/* Arrow divider */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: `${token.marginSM}px 0`,
        }}>
          <SwapOutlined 
            rotate={90}
            style={{ 
              fontSize: 16, 
              color: token.colorTextTertiary,
              padding: 8,
              background: token.colorBgLayout,
              borderRadius: '50%',
            }} 
          />
        </div>
        
        {/* Secondary input (You get) */}
        <div>
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
              You get (estimate)
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: token.colorBgLayout,
            borderRadius: token.borderRadius,
            padding: `${token.paddingMD}px`,
          }}>
            <input
              type="number"
              value={isBuy ? amount : cashAmount}
              onChange={(e) => {
                if (isBuy) {
                  const v = e.target.value;
                  setAmount(v);
                  const num = parseFloat(v) || 0;
                  if (num > 0 && price > 0) {
                    setCashAmount((num * price).toFixed(2));
                  } else {
                    setCashAmount('');
                  }
                } else {
                  const v = restrictCashDecimals(e.target.value);
                  setCashAmount(v);
                  const num = parseFloat(v) || 0;
                  if (num > 0 && price > 0) {
                    setAmount((num / price).toFixed(8));
                  } else {
                    setAmount('');
                  }
                }
              }}
              placeholder="0.00"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 24,
                fontWeight: fontWeights.bold,
                color: isBuy ? token.colorSuccess : token.colorText,
                backgroundColor: 'transparent',
                minWidth: 0,
              }}
            />
            <span style={{ color: token.colorTextSecondary, fontSize: token.fontSize, fontWeight: fontWeights.semibold }}>
              {isBuy ? selectedAsset : 'USD'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Insufficient Balance Warning - Minimal */}
      <AnimatePresence>
        {(cashAmountNum > 0 || amountNum > 0) && (
          (isBuy && cashAmountNum > cashBalance + 0.01) || (!isBuy && amountNum > tokenBalance) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                marginBottom: token.marginSM,
                fontSize: token.fontSizeSM,
                color: token.colorError,
              }}
            >
              <InfoCircleOutlined style={{ marginRight: 4 }} />
              {isBuy 
                ? `Insufficient funds (need $${cashAmountNum.toFixed(2)})`
                : `Insufficient ${selectedAsset}`
              }
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
      
      {/* Fee Summary - Collapsible */}
      <AnimatePresence>
        {cashAmountNum > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ marginBottom: token.marginMD }}
          >
            {/* Summary line - always visible */}
            <div 
              onClick={() => setShowFeeDetails(!showFeeDetails)}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                padding: `${token.paddingXS}px 0`,
                fontSize: token.fontSizeSM,
                color: token.colorTextSecondary,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Fee ${fee.toFixed(2)}
                <DownOutlined style={{ 
                  fontSize: 8, 
                  transform: showFeeDetails ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }} />
              </span>
              <span style={{ 
                color: isBuy ? token.colorSuccess : token.colorText, 
                fontWeight: fontWeights.semibold 
              }}>
                → {isBuy 
                  ? `${receiveAmount.toFixed(4)} ${selectedAsset}`
                  : `$${receiveAmount.toFixed(2)}`
                }
              </span>
            </div>
            
            {/* Expanded details */}
            <AnimatePresence>
              {showFeeDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ 
                    fontSize: 12, 
                    color: token.colorTextTertiary,
                    paddingTop: token.paddingXS,
                    borderTop: `1px dashed ${token.colorBorderSecondary}`,
                    marginTop: token.marginXS,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span>Price</span>
                    <span>${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: price < 1 ? 4 : 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Fee (0.5%)</span>
                    <span>${fee.toFixed(2)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
      
      {/* Token Picker - Drawer (bottom sheet) on mobile, Modal on desktop */}
      {isMobile ? (
        <Drawer
          title="Select Token"
          placement="bottom"
          open={showTokenPicker}
          onClose={() => {
            setShowTokenPicker(false);
            setSearchQuery('');
          }}
          height="70vh"
          styles={{
            header: {
              padding: `${token.paddingSM}px ${token.paddingMD}px`,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
            },
            body: {
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <div style={{ padding: `${token.paddingSM}px ${token.paddingMD}px` }}>
            <Input
              prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                borderRadius: token.borderRadius,
                background: token.colorBgLayout,
              }}
              allowClear
            />
          </div>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: `0 ${token.paddingXS}px ${token.paddingSM}px`,
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
                      cursor: 'pointer',
                      borderRadius: token.borderRadius,
                      backgroundColor: isSelected ? token.colorPrimaryBg : 'transparent',
                    }}
                  >
                    <img
                      src={pair.iconUrl}
                      alt={pair.baseCurrency}
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%', flexShrink: 0 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${pair.baseCurrency}&background=667eea&color=fff&size=80`;
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: fontWeights.semibold, color: token.colorText, fontSize: token.fontSize }}>
                          {pair.baseCurrency}
                        </span>
                        {(pair as TradingPair).isCollegeCoin && (
                          <span style={{ fontSize: 10, color: '#fff', background: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)', padding: '2px 6px', borderRadius: 4 }}>
                            College
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: token.fontSizeSM, color: token.colorTextTertiary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pair.name}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: token.fontSize, color: token.colorText, fontWeight: fontWeights.medium }}>
                        ${pair.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: pair.price < 1 ? 4 : 2 })}
                      </div>
                      {balance > 0 && (
                        <div style={{ fontSize: token.fontSizeSM, color: token.colorTextTertiary }}>{balance.toFixed(balance < 1 ? 4 : 2)}</div>
                      )}
                    </div>
                    {isSelected && <CheckOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />}
                  </div>
                );
              })
            )}
          </div>
        </Drawer>
      ) : (
        <Modal
          title="Select Token"
          open={showTokenPicker}
          onCancel={() => {
            setShowTokenPicker(false);
            setSearchQuery('');
          }}
          footer={null}
          width={480}
          centered
          destroyOnClose={false}
          styles={{
            header: {
              padding: `${token.paddingSM}px ${token.paddingMD}px`,
              marginBottom: 0,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
            },
            body: {
              padding: 0,
            },
            mask: {
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <div style={{ padding: `${token.paddingSM}px ${token.paddingMD}px` }}>
            <Input
              prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                borderRadius: token.borderRadius,
                background: token.colorBgLayout,
              }}
              allowClear
            />
          </div>
          <div style={{
            maxHeight: 400,
            overflowY: 'auto',
            padding: `0 ${token.paddingXS}px ${token.paddingSM}px`,
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
                      cursor: 'pointer',
                      borderRadius: token.borderRadius,
                      backgroundColor: isSelected 
                        ? token.colorPrimaryBg
                        : 'transparent',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = token.colorFillTertiary;
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
                      style={{ borderRadius: '50%', flexShrink: 0 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${pair.baseCurrency}&background=667eea&color=fff&size=80`;
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                          }}>
                            College
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize: token.fontSizeSM,
                        color: token.colorTextTertiary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {pair.name}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontSize: token.fontSize,
                        color: token.colorText,
                        fontWeight: fontWeights.medium,
                      }}>
                        ${pair.price.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: pair.price < 1 ? 4 : 2 
                        })}
                      </div>
                      {balance > 0 && (
                        <div style={{ fontSize: token.fontSizeSM, color: token.colorTextTertiary }}>
                          {balance.toFixed(balance < 1 ? 4 : 2)}
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
        </Modal>
      )}
      
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
          setIsSimulatedFailure(false);
        }}
        onStatusUpdate={(updatedOrder) => {
          setCurrentOrder(updatedOrder);
        }}
        isLearnerMode={appMode === 'learner'}
        isSimulatedFailure={isSimulatedFailure}
      />
    </div>
  );
};

export default BuySellForm;

