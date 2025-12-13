import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { theme, Grid, Skeleton, Row, Col, Button } from 'antd';
import {
  WalletOutlined,
  SwapOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import AssetCard from '@/components/dashboard/AssetCard';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

export default function WalletPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user, isLoading } = useAuth();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  // Wait for client-side mount to avoid hydration mismatch with useBreakpoint
  const isMobile = mounted ? !screens.md : false;

  // Set mounted state for hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?redirect=/wallet');
        return;
      }
      if (user.kycStatus !== 'APPROVED' && user.kycStatus !== 'PENDING') {
        router.push('/onboarding');
        return;
      }
      setPageLoading(false);
    }
  }, [user, isLoading, router]);

  const sectionStyle: React.CSSProperties = {
    marginBottom: token.marginXL,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading4,
    fontWeight: fontWeights.bold,
    color: token.colorText,
    marginBottom: token.marginMD,
  };

  const actionButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: token.marginSM,
    flexWrap: 'wrap',
  };

  const buttonStyle: React.CSSProperties = {
    height: token.controlHeightLG,
    fontSize: token.fontSize,
    fontWeight: fontWeights.medium,
    borderRadius: token.borderRadius,
    display: 'flex',
    alignItems: 'center',
    gap: token.marginXS,
  };

  // Mock data
  const assets = [
    { symbol: 'TUIT', name: 'Tuition Token', balance: '1,250.00', value: '$1,250.00', change: 2.5, color: token.colorPrimary },
    { symbol: 'BTC', name: 'Bitcoin', balance: '0.0125', value: '$525.00', change: -1.2, color: '#F7931A' },
    { symbol: 'ETH', name: 'Ethereum', balance: '0.25', value: '$475.00', change: 3.8, color: '#627EEA' },
    { symbol: 'USDT', name: 'Tether', balance: '500.00', value: '$500.00', change: 0, color: '#26A17B' },
  ];

  if (pageLoading) {
    return (
      <>
        <Head>
          <title>Wallet - InTuition Exchange</title>
        </Head>
        <DashboardLayout activeKey="wallet">
          <Skeleton active paragraph={{ rows: 12 }} />
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Wallet - InTuition Exchange</title>
        <meta name="description" content="Manage your crypto assets" />
      </Head>

      <DashboardLayout activeKey="wallet">
        {/* Balance Stats */}
        <motion.div
          style={sectionStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Row gutter={[token.marginMD, token.marginMD]}>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Total Balance"
                value="$2,750.00"
                icon={<WalletOutlined />}
                color={token.colorPrimary}
                trend={{ value: 5.2, isPositive: true }}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Crypto Balance"
                value="$2,250.00"
                subtitle="4 assets"
                icon={<SwapOutlined />}
                color={token.colorSuccess}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Fiat Balance"
                value="$500.00"
                subtitle="USD"
                icon={<PlusOutlined />}
                color={token.colorWarning}
              />
            </Col>
          </Row>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          style={sectionStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div style={actionButtonsStyle}>
            <Button type="primary" style={buttonStyle}>
              <PlusOutlined /> Deposit
            </Button>
            <Button style={buttonStyle}>
              <ArrowUpOutlined /> Withdraw
            </Button>
            <Button style={buttonStyle}>
              <SwapOutlined /> Trade
            </Button>
            <Button style={buttonStyle}>
              <QrcodeOutlined /> Receive
            </Button>
          </div>
        </motion.div>

        {/* Assets */}
        <motion.div
          style={sectionStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div style={sectionTitleStyle}>Your Assets</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: token.marginSM }}>
            {assets.map((asset, index) => (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <AssetCard
                  symbol={asset.symbol}
                  name={asset.name}
                  balance={asset.balance}
                  value={asset.value}
                  change={asset.change}
                  color={asset.color}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Deposit Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div style={sectionTitleStyle}>Your Deposit Address</div>
          <div style={{
            backgroundColor: token.colorBgContainer,
            borderRadius: token.borderRadius,
            padding: token.paddingLG,
          }}>
            <div style={{
              fontSize: token.fontSize,
              color: token.colorTextSecondary,
              marginBottom: token.marginSM,
            }}>
              TUIT Deposit Address (ERC-20)
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: token.marginMD,
              flexWrap: 'wrap',
            }}>
              <code style={{
                flex: 1,
                fontSize: token.fontSize,
                color: token.colorText,
                backgroundColor: token.colorBgLayout,
                padding: `${token.paddingSM}px ${token.paddingMD}px`,
                borderRadius: token.borderRadius,
                wordBreak: 'break-all',
              }}>
                0x742d35Cc6634C0532925a3b844Bc9e7595...
              </code>
              <Button icon={<CopyOutlined />} style={buttonStyle}>
                Copy
              </Button>
              <Button icon={<QrcodeOutlined />} style={buttonStyle}>
                QR Code
              </Button>
            </div>
          </div>
        </motion.div>
      </DashboardLayout>
    </>
  );
}

