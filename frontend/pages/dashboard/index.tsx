import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { theme, Grid, Skeleton, Row, Col } from 'antd';
import {
  WalletOutlined,
  SwapOutlined,
  TeamOutlined,
  CreditCardOutlined,
  BankOutlined,
  HistoryOutlined,
  DollarOutlined,
  RiseOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ActionCard from '@/components/dashboard/ActionCard';
import AssetCard from '@/components/dashboard/AssetCard';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

export default function DashboardPage() {
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
        router.push('/login?redirect=/dashboard');
        return;
      }
      // Check KYC status
      if (user.kycStatus !== 'APPROVED' && user.kycStatus !== 'PENDING') {
        router.push('/onboarding');
        return;
      }
      setPageLoading(false);
    }
  }, [user, isLoading, router]);

  // Section styles
  const sectionStyle: React.CSSProperties = {
    marginBottom: token.marginXL,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading4,
    fontWeight: fontWeights.bold,
    color: token.colorText,
    marginBottom: token.marginMD,
  };

  // Mock data - will be replaced with real API data
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
          <title>Dashboard - InTuition Exchange</title>
        </Head>
        <DashboardLayout activeKey="dashboard">
          <Skeleton active paragraph={{ rows: 12 }} />
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - InTuition Exchange</title>
        <meta name="description" content="Your InTuition Exchange dashboard" />
      </Head>

      <DashboardLayout activeKey="dashboard">
        {/* Stats Grid */}
        <motion.div
          style={sectionStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Row gutter={[token.marginMD, token.marginMD]}>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Total Balance"
                value="$2,750.00"
                icon={<WalletOutlined />}
                color={token.colorPrimary}
                trend={{ value: 5.2, isPositive: true }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="TUIT Holdings"
                value="1,250"
                subtitle="≈ $1,250.00"
                icon={<DollarOutlined />}
                color={token.colorSuccess}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Today's Profit"
                value="+$42.50"
                icon={<RiseOutlined />}
                color={token.colorWarning}
                trend={{ value: 12.3, isPositive: true }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Rewards"
                value="$25.00"
                subtitle="Claim available"
                icon={<GiftOutlined />}
                color={token.colorError}
              />
            </Col>
          </Row>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          style={sectionStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div style={sectionTitleStyle}>Quick Actions</div>
          <Row gutter={[token.marginMD, token.marginMD]}>
            <Col xs={24} sm={12} lg={6}>
              <ActionCard
                title="Deposit"
                description="Add funds to your wallet"
                icon={<CreditCardOutlined />}
                color={token.colorSuccess}
                onClick={() => router.push('/wallet?action=deposit')}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <ActionCard
                title="Trade"
                description="Buy or sell crypto"
                icon={<SwapOutlined />}
                color={token.colorWarning}
                onClick={() => router.push('/exchange')}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <ActionCard
                title="P2P Market"
                description="Trade with others"
                icon={<TeamOutlined />}
                color={token.colorPrimary}
                onClick={() => router.push('/p2p')}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <ActionCard
                title="Withdraw"
                description="Transfer to bank"
                icon={<BankOutlined />}
                color={token.colorError}
                onClick={() => router.push('/wallet?action=withdraw')}
              />
            </Col>
          </Row>
        </motion.div>

        {/* Assets */}
        <motion.div
          style={sectionStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div style={{ ...sectionTitleStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Your Assets</span>
            <span
              style={{ fontSize: token.fontSize, fontWeight: fontWeights.medium, color: token.colorPrimary, cursor: 'pointer' }}
              onClick={() => router.push('/wallet')}
            >
              View All →
            </span>
          </div>
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
                  onClick={() => router.push(`/wallet/${asset.symbol.toLowerCase()}`)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          style={sectionStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div style={{ ...sectionTitleStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Recent Activity</span>
            <span
              style={{ fontSize: token.fontSize, fontWeight: fontWeights.medium, color: token.colorPrimary, cursor: 'pointer' }}
            >
              View All →
            </span>
          </div>
          <div style={{
            backgroundColor: token.colorBgContainer,
            borderRadius: token.borderRadius,
            padding: token.paddingXL,
            textAlign: 'center',
            color: token.colorTextSecondary,
          }}>
            <HistoryOutlined style={{ fontSize: token.fontSizeHeading1, marginBottom: token.marginMD, opacity: 0.5 }} />
            <div style={{ fontSize: token.fontSizeLG }}>No recent activity</div>
            <div style={{ fontSize: token.fontSize, marginTop: token.marginXS }}>
              Your transactions will appear here
            </div>
          </div>
        </motion.div>
      </DashboardLayout>
    </>
  );
}

