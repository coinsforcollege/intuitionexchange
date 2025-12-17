'use client';

import React, { useState, useEffect } from 'react';
import { theme, Button, Modal, message } from 'antd';
import { CloseOutlined, SwapOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'motion/react';
import { fontWeights } from '@/theme/themeConfig';
import { useThemeMode } from '@/context/ThemeContext';

const { useToken } = theme;

type OrderSide = 'BUY' | 'SELL';

interface TradeFormModalProps {
  visible: boolean;
  onClose: () => void;
  side: OrderSide;
  symbol: string;
  price: number;
  baseAsset: string;
  quoteAsset: string;
  baseBalance?: number;
  quoteBalance?: number;
  onTrade?: (side: OrderSide, amount: number, total: number) => Promise<void>;
  isLoading?: boolean;
}

const TradeFormModal: React.FC<TradeFormModalProps> = ({
  visible,
  onClose,
  side,
  symbol,
  price,
  baseAsset,
  quoteAsset,
  baseBalance = 0,
  quoteBalance = 0,
  onTrade,
  isLoading = false,
}) => {
  const { token } = useToken();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const [amount, setAmount] = useState<string>('');
  const [total, setTotal] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);

  const isBuy = side === 'BUY';
  const amountNum = parseFloat(amount) || 0;
  const totalNum = parseFloat(total) || 0;

  // Reset form when modal opens/closes or pair changes
  useEffect(() => {
    if (visible) {
      setAmount('');
      setTotal('');
      setShowConfirm(false);
    }
  }, [visible, symbol]);

  // Calculate total when amount changes
  const handleAmountChange = (value: string) => {
    setAmount(value);
    const num = parseFloat(value) || 0;
    if (num > 0 && price > 0) {
      const totalValue = num * price;
      const decimals = quoteAsset === 'USD' ? 2 : 8;
      setTotal(totalValue.toFixed(decimals));
    } else {
      setTotal('');
    }
  };

  // Calculate amount when total changes
  const handleTotalChange = (value: string) => {
    setTotal(value);
    const num = parseFloat(value) || 0;
    if (num > 0 && price > 0) {
      setAmount((num / price).toFixed(8));
    } else {
      setAmount('');
    }
  };

  // Percentage buttons
  const handlePercentage = (percent: number) => {
    if (price <= 0) return;
    
    const totalDecimals = quoteAsset === 'USD' ? 2 : 8;
    const precisionMultiplier = quoteAsset === 'USD' ? 100 : 100000000;
    
    if (isBuy) {
      const maxTotal = percent === 100 
        ? Math.floor(quoteBalance * precisionMultiplier) / precisionMultiplier
        : quoteBalance * (percent / 100);
      setTotal(maxTotal.toFixed(totalDecimals));
      if (price > 0) {
        setAmount((maxTotal / price).toFixed(8));
      }
    } else {
      const maxAmount = percent === 100
        ? Math.floor(baseBalance * 100000000) / 100000000
        : baseBalance * (percent / 100);
      setAmount(maxAmount.toFixed(8));
      if (price > 0) {
        setTotal((maxAmount * price).toFixed(totalDecimals));
      }
    }
  };

  // Handle trade submission
  const handleSubmit = async () => {
    if (!amountNum || !totalNum) return;
    
    if (isBuy && totalNum > quoteBalance + 0.01) {
      message.error(`Insufficient ${quoteAsset} balance`);
      setShowConfirm(false);
      return;
    }
    
    if (!isBuy && amountNum > baseBalance) {
      message.error(`Insufficient ${baseAsset} balance`);
      setShowConfirm(false);
      return;
    }
    
    setShowConfirm(false);
    
    try {
      if (onTrade) {
        await onTrade(side, amountNum, totalNum);
      }
      setAmount('');
      setTotal('');
      onClose();
    } catch (error: any) {
      console.error('Trade failed:', error);
    }
  };

  // Fee calculation (0.5%)
  const fee = isBuy ? totalNum * 0.005 : amountNum * price * 0.005;
  const receiveAmount = isBuy ? amountNum : (amountNum * price) - fee;

  // Check if balance is insufficient
  const insufficientBalance = (isBuy && totalNum > quoteBalance + 0.01) || (!isBuy && amountNum > baseBalance);

  // Custom input with addon
  const InputWithAddon = ({ 
    value, 
    onChange, 
    addon, 
    placeholder,
    label,
    balance,
  }: { 
    value: string; 
    onChange: (v: string) => void; 
    addon: string; 
    placeholder: string;
    label: string;
    balance: string;
  }) => (
    <div style={{ marginBottom: token.marginMD }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: token.marginXS,
      }}>
        <span style={{ 
          fontSize: token.fontSizeSM, 
          color: token.colorTextSecondary,
          fontWeight: fontWeights.medium,
        }}>
          {label}
        </span>
        <span style={{ 
          fontSize: token.fontSizeSM, 
          color: token.colorTextTertiary,
        }}>
          Avail: {balance}
        </span>
      </div>
      <div style={{
        display: 'flex',
        border: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
        transition: 'all 0.2s ease',
      }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: `${token.paddingMD}px ${token.paddingLG}px`,
            border: 'none',
            outline: 'none',
            fontSize: token.fontSizeXL,
            fontWeight: fontWeights.bold,
            color: token.colorText,
            backgroundColor: 'transparent',
            minWidth: 0,
          }}
        />
        <div style={{
          padding: `${token.paddingMD}px ${token.paddingLG}px`,
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
          color: token.colorTextSecondary,
          fontSize: token.fontSize,
          fontWeight: fontWeights.semibold,
          display: 'flex',
          alignItems: 'center',
          borderLeft: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
        }}>
          {addon}
        </div>
      </div>
    </div>
  );

  const modalContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${token.paddingMD}px ${token.paddingLG}px`,
          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isBuy ? '#22C55E' : '#EF4444',
            }}
          />
          <span
            style={{
              fontSize: token.fontSizeXL,
              fontWeight: fontWeights.bold,
              color: token.colorText,
            }}
          >
            {isBuy ? 'Buy' : 'Sell'} {baseAsset}
          </span>
        </div>
        <div
          onClick={onClose}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <CloseOutlined style={{ fontSize: 16, color: token.colorText }} />
        </div>
      </div>

      {/* Price Display */}
      <div
        style={{
          padding: `${token.paddingLG}px ${token.paddingLG}px ${token.paddingMD}px`,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary, marginBottom: token.marginXS }}>
          Current Price
        </div>
        <div style={{ 
          fontSize: 32, 
          fontWeight: fontWeights.bold, 
          color: token.colorText,
          letterSpacing: '-0.02em',
        }}>
          {quoteAsset === 'USD' 
            ? `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
            : `${price.toLocaleString('en-US', { maximumFractionDigits: 8 })} ${quoteAsset}`
          }
        </div>
      </div>

      {/* Form Content */}
      <div style={{ flex: 1, padding: `0 ${token.paddingLG}px`, overflowY: 'auto' }}>
        {/* Amount Input */}
        <InputWithAddon
          value={amount}
          onChange={handleAmountChange}
          addon={baseAsset}
          placeholder="0.00"
          label="Amount"
          balance={`${baseBalance.toFixed(4)} ${baseAsset}`}
        />

        {/* Percentage Buttons */}
        <div style={{
          display: 'flex',
          gap: token.marginSM,
          marginBottom: token.marginMD,
        }}>
          {[25, 50, 75, 100].map((percent) => (
            <div
              key={percent}
              onClick={() => handlePercentage(percent)}
              style={{
                flex: 1,
                padding: `${token.paddingSM}px`,
                textAlign: 'center',
                fontSize: token.fontSize,
                fontWeight: fontWeights.semibold,
                color: token.colorTextSecondary,
                border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
              }}
            >
              {percent}%
            </div>
          ))}
        </div>

        {/* Swap Icon */}
        <div style={{ textAlign: 'center', margin: `${token.marginSM}px 0` }}>
          <SwapOutlined 
            rotate={90}
            style={{ 
              fontSize: 20, 
              color: token.colorTextTertiary,
              padding: token.paddingXS,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
              borderRadius: 8,
            }} 
          />
        </div>

        {/* Total Input */}
        <InputWithAddon
          value={total}
          onChange={handleTotalChange}
          addon={quoteAsset}
          placeholder="0.00"
          label="Total"
          balance={quoteAsset === 'USD' 
            ? `$${quoteBalance.toFixed(2)}`
            : `${quoteBalance.toFixed(4)} ${quoteAsset}`
          }
        />

        {/* Insufficient Balance Warning */}
        <AnimatePresence>
          {amountNum > 0 && insufficientBalance && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginBottom: token.marginMD,
                padding: token.paddingMD,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: 12,
                border: '1px solid rgba(239, 68, 68, 0.2)',
                fontSize: token.fontSizeSM,
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                gap: token.marginXS,
              }}
            >
              <InfoCircleOutlined />
              Insufficient balance
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fee Info */}
        <AnimatePresence>
          {amountNum > 0 && !insufficientBalance && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginBottom: token.marginMD,
                padding: token.paddingMD,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                borderRadius: 12,
                fontSize: token.fontSizeSM,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: token.marginXS, color: token.colorTextSecondary }}>
                <span>Fee (0.5%)</span>
                <span>
                  {quoteAsset === 'USD' ? `$${fee.toFixed(2)}` : `${fee.toFixed(8)} ${quoteAsset}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: token.colorTextSecondary }}>You {isBuy ? 'receive' : 'get'}</span>
                <span style={{ color: token.colorText, fontWeight: fontWeights.bold }}>
                  {isBuy 
                    ? `${receiveAmount.toFixed(6)} ${baseAsset}`
                    : quoteAsset === 'USD' ? `$${receiveAmount.toFixed(2)}` : `${receiveAmount.toFixed(8)} ${quoteAsset}`
                  }
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Submit Button */}
      <div
        style={{
          padding: `${token.paddingMD}px ${token.paddingLG}px`,
          paddingBottom: `calc(${token.paddingMD}px + env(safe-area-inset-bottom, 16px))`,
          borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
          backgroundColor: isDark ? 'rgba(15, 15, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <Button
          type="primary"
          size="large"
          block
          loading={isLoading}
          disabled={!amountNum || amountNum <= 0 || !totalNum || totalNum <= 0 || price <= 0 || insufficientBalance}
          onClick={() => setShowConfirm(true)}
          style={{
            height: 56,
            borderRadius: 14,
            fontWeight: fontWeights.bold,
            fontSize: token.fontSizeLG,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#ffffff',
            background: isBuy 
              ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
              : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            border: 'none',
            boxShadow: isBuy
              ? '0 8px 24px rgba(34, 197, 94, 0.3)'
              : '0 8px 24px rgba(239, 68, 68, 0.3)',
          }}
        >
          {isBuy ? 'Buy' : 'Sell'} {baseAsset}
        </Button>
      </div>
    </div>
  );

  if (!visible) return null;

  return (
    <>
      {/* Fullscreen overlay - no Ant Design Modal wrapper */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          background: isDark 
            ? 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f8f9fc 100%)',
        }}
      >
        {modalContent}
      </div>

      {/* Confirmation Modal - outside the fullscreen modal */}
      <Modal
        title={`Confirm ${side} Order`}
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        centered
        footer={[
          <Button key="cancel" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleSubmit}
            loading={isLoading}
            style={{
              background: isBuy ? '#22C55E' : '#EF4444',
              border: 'none',
            }}
          >
            Confirm {side}
          </Button>,
        ]}
      >
        <div style={{ padding: `${token.paddingMD}px 0` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: token.marginSM, fontSize: token.fontSize }}>
            <span style={{ color: token.colorTextSecondary }}>Type</span>
            <span style={{ color: isBuy ? '#22C55E' : '#EF4444', fontWeight: fontWeights.bold }}>
              Market {side}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: token.marginSM, fontSize: token.fontSize }}>
            <span style={{ color: token.colorTextSecondary }}>Amount</span>
            <span style={{ color: token.colorText, fontWeight: fontWeights.semibold }}>
              {amountNum.toFixed(6)} {baseAsset}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: token.marginSM, fontSize: token.fontSize }}>
            <span style={{ color: token.colorTextSecondary }}>Price</span>
            <span style={{ color: token.colorText }}>
              {quoteAsset === 'USD' 
                ? `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                : `${price.toFixed(8)} ${quoteAsset}`
              }
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: token.marginSM, fontSize: token.fontSize }}>
            <span style={{ color: token.colorTextSecondary }}>Fee (0.5%)</span>
            <span style={{ color: token.colorText }}>
              {quoteAsset === 'USD' ? `$${fee.toFixed(2)}` : `${fee.toFixed(8)} ${quoteAsset}`}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: token.paddingSM,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            fontSize: token.fontSizeLG,
          }}>
            <span style={{ color: token.colorTextSecondary }}>You {isBuy ? 'pay' : 'receive'}</span>
            <span style={{ color: token.colorText, fontWeight: fontWeights.bold }}>
              {isBuy 
                ? (quoteAsset === 'USD' ? `$${totalNum.toFixed(2)}` : `${totalNum.toFixed(8)} ${quoteAsset}`)
                : (quoteAsset === 'USD' ? `$${receiveAmount.toFixed(2)}` : `${receiveAmount.toFixed(8)} ${quoteAsset}`)
              }
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TradeFormModal;

