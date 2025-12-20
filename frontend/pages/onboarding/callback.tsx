import React from 'react';
import Head from 'next/head';
import { theme, Grid } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { fontWeights } from '@/theme/themeConfig';
import { useThemeMode } from '@/context/ThemeContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

export default function VeriffCallbackPage() {
  const { token } = useToken();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const isDark = mode === 'dark';
  const isMobile = !screens.md;

  const getCardStyle = (): React.CSSProperties => ({
    background: isDark
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(12px)',
    border: isDark
      ? '1px solid rgba(255,255,255,0.1)'
      : '1px solid rgba(255,255,255,0.3)',
    borderRadius: 16,
    padding: token.paddingLG,
    width: '100%',
    textAlign: 'center' as const,
  });

  return (
    <>
      <Head>
        <title>Verification Submitted - InTuition Exchange</title>
        <meta name="description" content="Your verification has been submitted" />
      </Head>

      <OnboardingLayout currentStep={3}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: token.marginLG }}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircleOutlined style={{ fontSize: 50, color: '#22C55E' }} />
          </motion.div>

          {/* Message */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: isMobile ? 24 : 32,
              fontWeight: fontWeights.bold,
              color: '#ffffff',
              marginBottom: token.marginXS,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}>
              Verification Submitted!
            </h2>
            <p style={{
              fontSize: token.fontSize,
              color: 'rgba(255,255,255,0.8)',
              maxWidth: 320,
              margin: '0 auto',
            }}>
              Your documents have been submitted for review.
            </p>
          </div>

          {/* Info Card */}
          <div style={getCardStyle()}>
            <p style={{
              fontSize: token.fontSize,
              color: '#ffffff',
              marginBottom: token.marginMD,
            }}>
              Close this tab and return to the previous page to see your verification status.
            </p>
            <p style={{
              fontSize: token.fontSizeSM,
              color: 'rgba(255,255,255,0.7)',
              marginBottom: 0,
            }}>
              Verification usually takes less than a minute.
            </p>
          </div>
        </motion.div>
      </OnboardingLayout>
    </>
  );
}

