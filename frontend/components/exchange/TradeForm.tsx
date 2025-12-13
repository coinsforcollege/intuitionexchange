'use client';

import React, { useState, useEffect } from 'react';
import { theme, Button, Modal } from 'antd';
import { SwapOutlined, InfoCircleOutlined, ThunderboltOutlined, ClockCircleOutlined, SafetyOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'motion/react';
import { fontWeights } from '@/theme/themeConfig';

const { useToken } = theme;

type OrderSide = 'BUY' | 'SELL';

interface TradeFormProps {
  symbol: string;
  price: number;
  baseAsset: string;
  quoteAsset: string;
  baseBalance?: number;
  quoteBalance?: number;
  onTrade?: (side: OrderSide, amount: number, total: number) => Promise<void>;
  isLoading?: boolean;
}

const TradeForm: React.FC<TradeFormProps> = ({
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
  const [side, setSide] = useState<OrderSide>('BUY');
  const [amount, setAmount] = useState<string>('');
  const [total, setTotal] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);
  const loading = isLoading;

  const isBuy = side === 'BUY';
  const amountNum = parseFloat(amount) || 0;
  const totalNum = parseFloat(total) || 0;

  // Calculate total when amount changes
  const handleAmountChange = (value: string) => {
    setAmount(value);
    const num = parseFloat(value) || 0;
    if (num && price) {
      setTotal((num * price).toFixed(2));
    } else {
      setTotal('');
    }
  };

  // Calculate amount when total changes
  const handleTotalChange = (value: string) => {
    setTotal(value);
    const num = parseFloat(value) || 0;
    if (num && price) {
      setAmount((num / price).toFixed(8));
    } else {
      setAmount('');
    }
  };

  // Percentage buttons
  const handlePercentage = (percent: number) => {
    if (isBuy) {
      const maxTotal = quoteBalance * (percent / 100);
      setTotal(maxTotal.toFixed(2));
      setAmount((maxTotal / price).toFixed(8));
    } else {
      const maxAmount = baseBalance * (percent / 100);
      setAmount(maxAmount.toFixed(8));
      setTotal((maxAmount * price).toFixed(2));
    }
  };

  // Handle trade submission
  const handleSubmit = async () => {
    if (!amountNum || !totalNum) return;
    
    setShowConfirm(false);
    
    try {
      if (onTrade) {
        await onTrade(side, amountNum, totalNum);
      }
      setAmount('');
      setTotal('');
    } catch (error) {
      console.error('Trade failed:', error);
    }
  };

  // Fee calculation (0.5%)
  const fee = totalNum * 0.005;
  const receiveAmount = isBuy ? amountNum : totalNum - fee;

  // Custom input with addon - proper rounded corners
  const InputWithAddon = ({ 
    value, 
    onChange, 
    addon, 
    placeholder 
  }: { 
    value: string; 
    onChange: (v: string) => void; 
    addon: string; 
    placeholder: string;
  }) => (
    <div style={{
      display: 'flex',
      border: `1px solid ${token.colorBorder}`,
      borderRadius: token.borderRadiusSM,
      overflow: 'hidden',
      backgroundColor: token.colorBgContainer,
    }}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: `${token.paddingSM}px ${token.paddingMD}px`,
          border: 'none',
          outline: 'none',
          fontSize: token.fontSize,
          fontWeight: fontWeights.medium,
          color: token.colorText,
          backgroundColor: 'transparent',
          minWidth: 0,
        }}
      />
      <div style={{
        padding: `${token.paddingSM}px ${token.paddingMD}px`,
        backgroundColor: token.colorBgLayout,
        color: token.colorTextSecondary,
        fontSize: token.fontSizeSM,
        fontWeight: fontWeights.semibold,
        display: 'flex',
        alignItems: 'center',
        borderLeft: `1px solid ${token.colorBorder}`,
      }}>
        {addon}
      </div>
    </div>
  );

  return (
    <div>
      {/* Buy/Sell Toggle - Grouped */}
      <div style={{
        display: 'flex',
        marginBottom: token.marginMD,
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadius,
        overflow: 'hidden',
      }}>
        {/* Buy Button - Left side rounded */}
        <div
          onClick={() => setSide('BUY')}
          style={{
            flex: 1,
            padding: `${token.paddingSM + 2}px`,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: side === 'BUY' ? token.colorSuccess : 'transparent',
            borderRight: `1px solid ${token.colorBorder}`,
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{
            fontSize: token.fontSize,
            fontWeight: fontWeights.bold,
            color: side === 'BUY' ? '#ffffff' : token.colorText,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            BUY
          </span>
        </div>
        {/* Sell Button - Right side rounded */}
        <div
          onClick={() => setSide('SELL')}
          style={{
            flex: 1,
            padding: `${token.paddingSM + 2}px`,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: side === 'SELL' ? token.colorError : 'transparent',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{
            fontSize: token.fontSize,
            fontWeight: fontWeights.bold,
            color: side === 'SELL' ? '#ffffff' : token.colorText,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            SELL
          </span>
        </div>
      </div>

      {/* Price Display - minimal */}
      <div style={{
        marginBottom: token.marginMD,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
          Price
        </span>
        <span style={{ fontSize: token.fontSizeLG, fontWeight: fontWeights.bold, color: token.colorText }}>
          ${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Amount Input */}
      <div style={{ marginBottom: token.marginSM }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: token.marginXS,
        }}>
          <span style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
            Amount
          </span>
          <span style={{ fontSize: 11, color: token.colorTextTertiary }}>
            Avail: {baseBalance.toFixed(4)} {baseAsset}
          </span>
        </div>
        <InputWithAddon
          value={amount}
          onChange={handleAmountChange}
          addon={baseAsset}
          placeholder="0.00"
        />
      </div>

      {/* Percentage Buttons - minimal */}
      <div style={{
        display: 'flex',
        gap: token.marginXS,
        marginBottom: token.marginSM,
      }}>
        {[25, 50, 75, 100].map((percent) => (
          <div
            key={percent}
            onClick={() => handlePercentage(percent)}
            style={{
              flex: 1,
              padding: `${token.paddingXS}px 0`,
              textAlign: 'center',
              fontSize: 10,
              fontWeight: fontWeights.medium,
              color: token.colorTextTertiary,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {percent}%
          </div>
        ))}
      </div>

      {/* Swap Icon */}
      <div style={{ textAlign: 'center', marginBottom: token.marginSM }}>
        <SwapOutlined 
          rotate={90}
          style={{ 
            fontSize: 14, 
            color: token.colorTextTertiary,
          }} 
        />
      </div>

      {/* Total Input */}
      <div style={{ marginBottom: token.marginMD }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: token.marginXS,
        }}>
          <span style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
            Total
          </span>
          <span style={{ fontSize: 11, color: token.colorTextTertiary }}>
            Avail: ${quoteBalance.toFixed(2)}
          </span>
        </div>
        <InputWithAddon
          value={total}
          onChange={handleTotalChange}
          addon={quoteAsset}
          placeholder="0.00"
        />
      </div>

      {/* Fee Info - inline */}
      <AnimatePresence>
        {amountNum > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginBottom: token.marginMD,
              fontSize: 11,
              color: token.colorTextSecondary,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span>Fee (0.5%)</span>
              <span>${fee.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>You {isBuy ? 'receive' : 'get'}</span>
              <span style={{ color: token.colorText, fontWeight: fontWeights.semibold }}>
                {isBuy 
                  ? `${receiveAmount.toFixed(6)} ${baseAsset}`
                  : `$${receiveAmount.toFixed(2)}`
                }
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <Button
        type="primary"
        size="large"
        block
        loading={loading}
        disabled={!amountNum || amountNum <= 0}
        onClick={() => setShowConfirm(true)}
        style={{
          height: token.controlHeightLG,
          borderRadius: token.borderRadiusSM,
          fontWeight: fontWeights.bold,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontSize: token.fontSize,
          background: isBuy 
            ? token.colorSuccess
            : token.colorError,
          border: 'none',
          color: '#ffffff',
        }}
      >
        {isBuy ? 'Buy' : 'Sell'} {baseAsset}
      </Button>

      {/* Trading Info */}
      <div style={{
        marginTop: token.marginLG,
        padding: token.paddingMD,
        backgroundColor: token.colorBgLayout,
        borderRadius: token.borderRadiusSM,
        fontSize: token.fontSizeSM,
        color: token.colorTextSecondary,
        lineHeight: 1.5,
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: token.marginXS,
          marginBottom: token.marginXS,
        }}>
          <ThunderboltOutlined style={{ color: token.colorWarning, marginTop: 1 }} />
          <span>
            <strong style={{ color: token.colorText }}>Market Order</strong> – Executes at best available price. Final price may vary slightly.
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: token.marginXS,
          marginBottom: token.marginXS,
        }}>
          <ClockCircleOutlined style={{ color: token.colorPrimary, marginTop: 1 }} />
          <span>
            <strong style={{ color: token.colorText }}>Slippage</strong> – Price may change between order placement and execution (~0.1-0.5%).
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: token.marginXS,
        }}>
          <SafetyOutlined style={{ color: token.colorSuccess, marginTop: 1 }} />
          <span>
            <strong style={{ color: token.colorText }}>Best Execution</strong> – We route orders for optimal fill price across liquidity pools.
          </span>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        title={`Confirm ${side} Order`}
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleSubmit}
            style={{
              background: isBuy ? token.colorSuccess : token.colorError,
              color: '#ffffff',
              border: 'none',
            }}
          >
            Confirm {side}
          </Button>,
        ]}
      >
        <div style={{ padding: `${token.paddingMD}px 0` }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: token.marginSM,
            fontSize: token.fontSize,
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
            fontSize: token.fontSize,
          }}>
            <span style={{ color: token.colorTextSecondary }}>Amount</span>
            <span style={{ color: token.colorText, fontWeight: fontWeights.semibold }}>
              {amountNum.toFixed(6)} {baseAsset}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: token.marginSM,
            fontSize: token.fontSize,
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
            fontSize: token.fontSize,
          }}>
            <span style={{ color: token.colorTextSecondary }}>Fee (0.5%)</span>
            <span style={{ color: token.colorText }}>${fee.toFixed(2)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: token.paddingSM,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            fontSize: token.fontSizeLG,
          }}>
            <span style={{ color: token.colorTextSecondary }}>Total</span>
            <span style={{ color: token.colorText, fontWeight: fontWeights.bold }}>
              ${totalNum.toFixed(2)} {quoteAsset}
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TradeForm;
