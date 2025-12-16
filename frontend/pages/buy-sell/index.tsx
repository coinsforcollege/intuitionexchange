import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { theme, Grid, Skeleton } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

export default function BuySellPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user, isLoading } = useAuth();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const isDark = mode === 'dark';
  const isMobile = mounted ? !screens.md : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?redirect=/buy-sell');
        return;
      }
      if (user.kycStatus !== 'APPROVED' && user.kycStatus !== 'PENDING') {
        router.push('/onboarding');
        return;
      }
      setPageLoading(false);
    }
  }, [user, isLoading, router]);

  if (pageLoading) {
    return (
      <>
        <Head>
          <title>Buy & Sell - InTuition Exchange</title>
        </Head>
        <DashboardLayout activeKey="buy-sell">
          <Skeleton active paragraph={{ rows: 12 }} />
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Buy & Sell - InTuition Exchange</title>
        <meta name="description" content="Buy and sell cryptocurrency instantly" />
      </Head>

      <DashboardLayout activeKey="buy-sell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? 'calc(100vh - 200px)' : 400,
            textAlign: 'center',
            padding: token.paddingXL,
          }}
        >
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: token.marginXL,
              boxShadow: '0 16px 48px rgba(102, 126, 234, 0.35)',
            }}
          >
            <ShoppingCartOutlined
              style={{
                fontSize: 48,
                color: '#fff',
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: isMobile ? token.fontSizeHeading3 : token.fontSizeHeading2,
              fontWeight: fontWeights.bold,
              color: token.colorText,
              marginBottom: token.marginMD,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Buy & Sell
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: token.fontSizeLG,
              color: token.colorTextSecondary,
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            Instantly buy and sell cryptocurrency with your preferred payment method.
          </motion.p>

          {/* Coming Soon Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: token.marginXL,
              padding: `${token.paddingSM}px ${token.paddingLG}px`,
              borderRadius: 50,
              background: isDark
                ? 'rgba(102, 126, 234, 0.2)'
                : 'rgba(102, 126, 234, 0.1)',
              border: `1px solid ${isDark ? 'rgba(102, 126, 234, 0.4)' : 'rgba(102, 126, 234, 0.3)'}`,
              color: token.colorPrimary,
              fontSize: token.fontSize,
              fontWeight: fontWeights.semibold,
            }}
          >
            Coming Soon
          </motion.div>
        </motion.div>
      </DashboardLayout>
    </>
  );
}


