import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { Button, theme, Grid, Skeleton } from 'antd';
import { ArrowRightOutlined, SafetyCertificateOutlined, ClockCircleOutlined, GlobalOutlined, LockOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';
import { getKycStatus, KycStatus } from '@/services/api/onboarding';

const { useToken } = theme;
const { useBreakpoint } = Grid;

const features = [
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Secure',
    description: 'Bank-level encryption protects your data',
    emoji: '🔒',
  },
  {
    icon: <ClockCircleOutlined />,
    title: 'Quick',
    description: 'Done in 2-3 minutes',
    emoji: '⚡',
  },
  {
    icon: <GlobalOutlined />,
    title: 'Global',
    description: 'IDs from 230+ countries accepted',
    emoji: '🌍',
  },
  {
    icon: <LockOutlined />,
    title: 'Private',
    description: 'Your info stays confidential',
    emoji: '🛡️',
  },
];

// Theme colors
const themeColors = {
  primary: '#6366F1',
  light: '#A5B4FC',
  dark: '#4338CA',
};

// Warm palette for light mode buttons
const warmColors = {
  buttonText: '#3D2B1F',
  coral: '#E07A5F',
};

export default function OnboardingWelcome() {
  const router = useRouter();
  const { token } = useToken();
  const { user } = useAuth();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const isDark = mode === 'dark';
  const isMobile = !screens.md;
  
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<KycStatus | null>(null);

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      router.push('/login?redirect=/onboarding');
      return;
    }

    // Check current KYC status
    const checkStatus = async () => {
      try {
        const status = await getKycStatus();
        setKycStatus(status);
        
        // Redirect based on status
        if (status.status === 'APPROVED') {
          router.replace('/overview');
        } else if (status.currentStep >= 1) {
          // Resume from where they left off
          const stepRoutes = ['/onboarding', '/onboarding/personal', '/onboarding/address', '/onboarding/verify', '/onboarding/status'];
          router.replace(stepRoutes[status.currentStep] || '/onboarding/personal');
        }
      } catch {
        // If API fails, continue to show welcome page
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user, router]);

  const handleStart = () => {
    router.push('/onboarding/personal');
  };

  // Styles
  const getCardStyle = (): React.CSSProperties => ({
    background: isDark
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(12px)',
    border: isDark
      ? '1px solid rgba(255,255,255,0.1)'
      : '1px solid rgba(255,255,255,0.3)',
    borderRadius: 16,
    padding: isMobile ? token.paddingMD : token.paddingLG,
  });

  const getButtonStyle = (): React.CSSProperties => ({
    background: isDark
      ? `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.dark} 100%)`
      : `linear-gradient(135deg, ${warmColors.coral} 0%, #C45C44 100%)`,
    boxShadow: isDark
      ? `0 4px 14px rgba(99, 102, 241, 0.4)`
      : `0 4px 14px rgba(224,122,95,0.4)`,
    border: 'none',
    borderRadius: 12,
    color: '#ffffff',
    fontWeight: fontWeights.bold,
    height: 52,
    fontSize: token.fontSizeLG,
  });

  if (loading) {
    return (
      <>
        <Head>
          <title>Verify Your Identity - InTuition Exchange</title>
        </Head>
        <OnboardingLayout currentStep={0}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: token.marginLG }}>
            <Skeleton.Avatar active size={140} shape="circle" />
            <Skeleton active paragraph={{ rows: 2 }} style={{ width: '100%', maxWidth: 300 }} />
          </div>
        </OnboardingLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Verify Your Identity - InTuition Exchange</title>
        <meta name="description" content="Complete KYC verification to start trading" />
      </Head>

      <OnboardingLayout currentStep={0} title="Verify Your Identity" subtitle="Quick verification to unlock full trading access">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? token.marginMD : token.marginLG,
          }}
        >
          {/* Hero Image */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            style={{
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))',
              marginBottom: token.marginSM,
            }}
          >
            <Image
              src="/images/kyc-3d.png"
              alt="KYC Verification"
              width={isMobile ? 120 : 160}
              height={isMobile ? 120 : 160}
              style={{ objectFit: 'contain' }}
            />
          </motion.div>

          {/* Process Steps */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? token.marginSM : token.marginMD,
            marginBottom: token.marginSM,
            fontSize: isMobile ? 22 : 28,
          }}>
            <span>✏️</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>→</span>
            <span>📄</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>→</span>
            <span>📷</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>→</span>
            <span>✅</span>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: token.marginSM,
            width: '100%',
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.08 }}
                style={{
                  ...getCardStyle(),
                  display: 'flex',
                  alignItems: 'center',
                  gap: token.marginSM,
                  padding: isMobile ? `${token.paddingSM}px ${token.paddingMD}px` : token.paddingMD,
                }}
              >
                <span style={{ fontSize: isMobile ? 20 : 24 }}>{feature.emoji}</span>
                <div>
                  <div style={{
                    fontSize: token.fontSize,
                    fontWeight: fontWeights.semibold,
                    color: '#ffffff',
                  }}>
                    {feature.title}
                  </div>
                  <div style={{
                    fontSize: token.fontSizeSM,
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.3,
                  }}>
                    {feature.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            style={{ width: '100%', marginTop: token.marginSM }}
          >
            <Button
              type="primary"
              size="large"
              block
              onClick={handleStart}
              style={getButtonStyle()}
            >
              Get Started <ArrowRightOutlined />
            </Button>

            <p style={{
              textAlign: 'center',
              fontSize: token.fontSizeSM,
              color: 'rgba(255,255,255,0.6)',
              marginTop: token.marginMD,
            }}>
              Takes about 2-3 minutes • Your data is encrypted
            </p>
          </motion.div>
        </motion.div>
      </OnboardingLayout>
    </>
  );
}
