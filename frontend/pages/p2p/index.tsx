import React, { useState, useEffect, ReactElement } from 'react';
import Head from 'next/head';
import { theme, Grid, Input, Button, message } from 'antd';
import {
  TeamOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  LockOutlined,
  BellOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fontWeights } from '@/theme/themeConfig';
import { useThemeMode } from '@/context/ThemeContext';
import type { NextPageWithLayout } from '../_app';

const { useToken } = theme;
const { useBreakpoint } = Grid;

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  isDark: boolean;
  token: ReturnType<typeof useToken>['token'];
  isMobile: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  delay, 
  isDark, 
  token,
  isMobile,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    style={{
      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      borderRadius: token.borderRadiusLG,
      padding: isMobile ? token.paddingLG : token.paddingXL,
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      height: '100%',
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: token.borderRadius,
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        color: '#fff',
        marginBottom: token.marginMD,
      }}
    >
      {icon}
    </div>
    <h3
      style={{
        fontSize: token.fontSizeLG,
        fontWeight: fontWeights.semibold,
        color: isDark ? '#fff' : '#111827',
        marginBottom: token.marginXS,
        margin: 0,
      }}
    >
      {title}
    </h3>
    <p
      style={{
        fontSize: token.fontSize,
        color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)',
        margin: 0,
        lineHeight: 1.6,
      }}
    >
      {description}
    </p>
  </motion.div>
);

const P2PComingSoon: NextPageWithLayout = () => {
  const { token } = useToken();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isDark = mode === 'dark';
  const isMobile = mounted ? !screens.md : false;
  const isTablet = mounted ? !screens.lg : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNotifyMe = () => {
    if (!email || !email.includes('@')) {
      message.error('Please enter a valid email address');
      return;
    }
    // In production, this would call an API to save the email
    setSubmitted(true);
    message.success('You\'ll be notified when P2P launches!');
  };

  const features = [
    {
      icon: <TeamOutlined />,
      title: 'Direct Trading',
      description: 'Trade directly with other users. No middleman, no delays. Connect with verified traders worldwide.',
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Escrow Protection',
      description: 'Every trade is protected by our secure escrow system. Your funds are safe until the trade is complete.',
    },
    {
      icon: <GlobalOutlined />,
      title: '100+ Payment Methods',
      description: 'Bank transfers, mobile money, gift cards, and more. Trade using your preferred payment method.',
    },
    {
      icon: <ThunderboltOutlined />,
      title: 'Instant Matching',
      description: 'Our smart matching algorithm connects you with the best offers in seconds.',
    },
    {
      icon: <DollarOutlined />,
      title: 'Zero Trading Fees',
      description: 'Keep more of your crypto. We charge zero fees for P2P trading during our launch period.',
    },
    {
      icon: <LockOutlined />,
      title: 'Dispute Resolution',
      description: '24/7 customer support with fair dispute resolution. Trade with confidence.',
    },
  ];

  const accentColor = '#6366F1';

  return (
    <>
      <Head>
        <title>P2P Trading - Coming Soon | InTuition</title>
        <meta name="description" content="Trade crypto directly with other users. Secure, fast, and fee-free P2P trading coming soon to InTuition." />
      </Head>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: 'center',
              paddingTop: isMobile ? token.paddingLG : token.paddingXL * 2,
              paddingBottom: isMobile ? token.paddingLG : token.paddingXL * 2,
            }}
          >
            {/* Coming Soon Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: token.marginXS,
                background: `linear-gradient(135deg, ${accentColor}20 0%, #8B5CF620 100%)`,
                border: `1px solid ${accentColor}40`,
                borderRadius: 50,
                padding: `${token.paddingXS}px ${token.paddingMD}px`,
                marginBottom: token.marginLG,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: accentColor,
                  animation: 'pulse 2s infinite',
                }}
              />
              <span
                style={{
                  fontSize: token.fontSizeSM,
                  fontWeight: fontWeights.semibold,
                  color: accentColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Coming Soon
              </span>
            </motion.div>

            {/* Main Title */}
            <h1
              style={{
                fontSize: isMobile ? 32 : 48,
                fontWeight: fontWeights.bold,
                color: isDark ? '#fff' : '#111827',
                margin: 0,
                marginBottom: token.marginMD,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              Peer-to-Peer{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Trading
              </span>
            </h1>

            <p
              style={{
                fontSize: isMobile ? token.fontSizeLG : 20,
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)',
                maxWidth: 600,
                margin: '0 auto',
                lineHeight: 1.6,
                marginBottom: token.marginXL,
              }}
            >
              Trade crypto directly with other users worldwide. 
              Secure escrow, zero fees, and 100+ payment methods.
            </p>

            {/* Notify Me Form */}
            {!submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: token.marginSM,
                  justifyContent: 'center',
                  alignItems: 'center',
                  maxWidth: 450,
                  margin: '0 auto',
                }}
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  prefix={<BellOutlined style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)' }} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onPressEnter={handleNotifyMe}
                  style={{
                    flex: 1,
                    borderRadius: 8,
                    height: 48,
                    width: isMobile ? '100%' : 'auto',
                  }}
                />
                <Button
                  type="primary"
                  size="large"
                  onClick={handleNotifyMe}
                  style={{
                    height: 48,
                    paddingLeft: token.paddingLG,
                    paddingRight: token.paddingLG,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    border: 'none',
                    fontWeight: fontWeights.semibold,
                    width: isMobile ? '100%' : 'auto',
                  }}
                >
                  Notify Me
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: token.marginSM,
                  background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 8,
                  padding: `${token.paddingSM}px ${token.paddingLG}px`,
                }}
              >
                <CheckCircleFilled style={{ color: '#10B981', fontSize: 18 }} />
                <span style={{ color: '#10B981', fontWeight: fontWeights.medium }}>
                  You're on the list! We'll notify you at launch.
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Features Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: token.marginLG,
              paddingBottom: token.paddingXL * 2,
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={0.1 * (index + 1)}
                isDark={isDark}
                token={token}
                isMobile={isMobile}
              />
            ))}
          </div>

          {/* Bottom CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            style={{
              textAlign: 'center',
              padding: isMobile ? token.paddingLG : token.paddingXL * 2,
              background: isDark 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)'
                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              borderRadius: token.borderRadiusLG,
              border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)'}`,
              marginBottom: token.marginXL,
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? token.fontSizeHeading4 : token.fontSizeHeading3,
                fontWeight: fontWeights.bold,
                color: isDark ? '#fff' : '#111827',
                margin: 0,
                marginBottom: token.marginSM,
              }}
            >
              Be the First to Trade
            </h2>
            <p
              style={{
                fontSize: token.fontSizeLG,
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)',
                margin: 0,
                maxWidth: 500,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Early adopters get exclusive benefits including zero fees for the first 3 months and priority support.
            </p>
          </motion.div>
        </div>

        {/* Pulse Animation Keyframes */}
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
    </>
  );
};

// Persistent layout - keeps DashboardLayout mounted across page navigations
P2PComingSoon.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default P2PComingSoon;

