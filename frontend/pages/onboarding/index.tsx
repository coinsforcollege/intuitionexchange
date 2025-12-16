import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button, theme, Grid, Skeleton } from 'antd';
import { ArrowRightOutlined, SafetyCertificateOutlined, ClockCircleOutlined, GlobalOutlined, LockOutlined } from '@ant-design/icons';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import WelcomeAnimation from '@/components/onboarding/animations/WelcomeAnimation';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { getKycStatus, KycStatus } from '@/services/api/onboarding';

const { useToken } = theme;
const { useBreakpoint } = Grid;

const features = [
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Secure Verification',
    description: 'Your data is encrypted and protected with industry-leading security',
  },
  {
    icon: <ClockCircleOutlined />,
    title: 'Quick Process',
    description: 'Complete your verification in just a few minutes',
  },
  {
    icon: <GlobalOutlined />,
    title: 'Global Coverage',
    description: 'We support ID documents from 230+ countries',
  },
  {
    icon: <LockOutlined />,
    title: 'Privacy First',
    description: 'Your personal information is never shared without consent',
  },
];

export default function OnboardingWelcome() {
  const router = useRouter();
  const { token } = useToken();
  const { user } = useAuth();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<KycStatus | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
          router.push('/overview');
        } else if (status.currentStep >= 1) {
          // Resume from where they left off
          const stepRoutes = ['/onboarding', '/onboarding/personal', '/onboarding/address', '/onboarding/verify', '/onboarding/status'];
          router.push(stepRoutes[status.currentStep] || '/onboarding/personal');
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

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: token.marginXL,
    padding: isMobile ? 0 : token.paddingLG,
  };

  const heroStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: token.marginMD,
    opacity: isAnimated ? 1 : 0,
    transform: `translateY(${isAnimated ? 0 : 20}px)`,
    transition: 'all 0.6s ease-out',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? token.fontSizeHeading3 : token.fontSizeHeading2,
    fontWeight: fontWeights.bold,
    color: token.colorText,
    marginBottom: token.marginSM,
    marginTop: token.marginXL,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: token.fontSizeLG,
    color: token.colorTextSecondary,
    maxWidth: 400,
    margin: '0 auto',
  };

  const featuresGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: token.marginMD,
    width: '100%',
    maxWidth: 500,
  };

  const featureCardStyle = (index: number): React.CSSProperties => ({
    backgroundColor: token.colorBgContainer,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadius,
    padding: token.paddingMD,
    display: 'flex',
    alignItems: 'flex-start',
    gap: token.marginSM,
    opacity: isAnimated ? 1 : 0,
    transform: `translateY(${isAnimated ? 0 : 20}px)`,
    transition: `all 0.6s ease-out ${0.2 + index * 0.1}s`,
  });

  const featureIconStyle: React.CSSProperties = {
    fontSize: token.fontSizeXL,
    color: token.colorPrimary,
    flexShrink: 0,
  };

  const featureTitleStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    fontWeight: fontWeights.semibold,
    color: token.colorText,
    marginBottom: token.marginXS / 2,
  };

  const featureDescStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    color: token.colorTextSecondary,
    lineHeight: 1.4,
  };

  const buttonContainerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 400,
    marginTop: token.marginLG,
    opacity: isAnimated ? 1 : 0,
    transform: `translateY(${isAnimated ? 0 : 20}px)`,
    transition: 'all 0.6s ease-out 0.6s',
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Verify Your Identity - InTuition Exchange</title>
        </Head>
        <OnboardingLayout currentStep={0}>
          <div style={containerStyle}>
            <Skeleton.Avatar active size={200} shape="square" />
            <Skeleton active paragraph={{ rows: 2 }} style={{ width: 300 }} />
            <div style={featuresGridStyle}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} active paragraph={{ rows: 2 }} />
              ))}
            </div>
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

      <OnboardingLayout currentStep={0}>
        <div style={containerStyle}>
          {/* Animated Hero */}
          <WelcomeAnimation />

          <div style={heroStyle}>
            <h1 style={titleStyle}>Verify Your Identity</h1>
            <p style={subtitleStyle}>
              Complete a quick verification to unlock full trading capabilities and secure your account
            </p>
          </div>

          {/* Features Grid */}
          <div style={featuresGridStyle}>
            {features.map((feature, index) => (
              <div key={index} style={featureCardStyle(index)}>
                <span style={featureIconStyle}>{feature.icon}</span>
                <div>
                  <div style={featureTitleStyle}>{feature.title}</div>
                  <div style={featureDescStyle}>{feature.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div style={buttonContainerStyle}>
            <Button
              type="primary"
              size="large"
              block
              onClick={handleStart}
              style={{
                height: token.controlHeightLG,
                fontSize: token.fontSizeLG,
                fontWeight: fontWeights.semibold,
                borderRadius: token.borderRadius,
              }}
            >
              Get Started <ArrowRightOutlined />
            </Button>

            <p
              style={{
                textAlign: 'center',
                fontSize: token.fontSize,
                color: token.colorTextSecondary,
                marginTop: token.marginMD,
              }}
            >
              This usually takes 2-3 minutes
            </p>
          </div>
        </div>
      </OnboardingLayout>
    </>
  );
}

