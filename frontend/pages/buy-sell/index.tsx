import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { theme, Grid, Skeleton } from 'antd';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BuySellForm from '@/components/exchange/BuySellForm';
import { useAuth } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

export default function BuySellPage() {
  const router = useRouter();
  const { asset } = router.query;
  const { token } = useToken();
  const { user, isLoading } = useAuth();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const isDark = mode === 'dark';
  const isMobile = mounted ? !screens.md : true;
  
  // Get initial asset from query parameter
  const initialAsset = typeof asset === 'string' ? asset.toUpperCase() : undefined;

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

  // Don't render anything while checking auth or if not logged in
  if (isLoading || !user) {
    return null;
  }

  if (pageLoading) {
    return (
      <>
        <Head>
          <title>Buy & Sell - InTuition Exchange</title>
        </Head>
        <DashboardLayout activeKey="buy-sell">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 200px)',
            padding: token.paddingLG,
          }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
              <Skeleton active paragraph={{ rows: 12 }} />
            </div>
          </div>
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Buy & Sell - InTuition Exchange</title>
        <meta name="description" content="Buy and sell cryptocurrency instantly with USD" />
      </Head>

      <DashboardLayout activeKey="buy-sell">
        {/* Background Pattern */}
        <div style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}>
          {/* Gradient orbs */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: isDark 
              ? 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(102, 126, 234, 0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: isDark 
              ? 'radial-gradient(circle, rgba(22, 196, 127, 0.06) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(22, 196, 127, 0.05) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: isMobile ? token.paddingSM : token.paddingMD,
            paddingTop: isMobile ? token.paddingMD : token.paddingSM,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Form Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              width: '100%',
              maxWidth: 420,
            }}
          >
            <BuySellForm initialAsset={initialAsset} />
          </motion.div>

          {/* Info Text - hidden on mobile since it's in the sticky footer */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                marginTop: token.marginXL,
                textAlign: 'center',
                maxWidth: 400,
              }}
            >
              <p style={{
                fontSize: token.fontSizeSM,
                color: token.colorTextTertiary,
                lineHeight: 1.6,
                margin: 0,
              }}>
                Trade instantly using your USD balance. Market orders execute at the best available price with a 0.5% fee.
              </p>
            </motion.div>
          )}
        </motion.div>
      </DashboardLayout>
    </>
  );
}
