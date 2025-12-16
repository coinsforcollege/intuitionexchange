import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button, theme, Grid, Skeleton, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, ArrowRightOutlined, ReloadOutlined } from '@ant-design/icons';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import SuccessAnimation from '@/components/onboarding/animations/SuccessAnimation';
import LoadingAnimation from '@/components/onboarding/animations/LoadingAnimation';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { getKycStatus, checkVeriffDecision, KycStatus } from '@/services/api/onboarding';

const { useToken } = theme;
const { useBreakpoint } = Grid;

type StatusType = 'loading' | 'approved' | 'pending' | 'rejected' | 'error';

export default function StatusPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user } = useAuth();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [status, setStatus] = useState<StatusType>('loading');
  const [kycData, setKycData] = useState<KycStatus | null>(null);
  const [rejectReason, setRejectReason] = useState<string | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/onboarding');
      return;
    }

    const checkStatus = async () => {
      try {
        const kycStatus = await getKycStatus();
        setKycData(kycStatus);

        if (kycStatus.status === 'APPROVED') {
          setStatus('approved');
        } else if (kycStatus.status === 'REJECTED') {
          setStatus('rejected');
          // Try to get the reason
          try {
            const decision = await checkVeriffDecision();
            setRejectReason(decision.reason);
          } catch {
            // Ignore error
          }
        } else if (kycStatus.status === 'SUBMITTED' || kycStatus.hasVeriffSession) {
          setStatus('pending');
        } else {
          // Not started or incomplete
          router.push('/onboarding');
        }
      } catch {
        setStatus('error');
      }
    };

    checkStatus();
  }, [user, router]);

  // Poll for updates if pending
  useEffect(() => {
    if (status !== 'pending') return;

    const pollInterval = setInterval(async () => {
      try {
        const kycStatus = await getKycStatus();
        
        if (kycStatus.status === 'APPROVED') {
          setStatus('approved');
          clearInterval(pollInterval);
        } else if (kycStatus.status === 'REJECTED') {
          setStatus('rejected');
          clearInterval(pollInterval);
        }
      } catch {
        // Continue polling
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [status]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: token.marginXL,
    padding: isMobile ? token.paddingMD : token.paddingXL,
    opacity: isAnimated ? 1 : 0,
    transform: `translateY(${isAnimated ? 0 : 20}px)`,
    transition: 'all 0.5s ease-out',
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? token.fontSizeHeading3 : token.fontSizeHeading2,
    fontWeight: fontWeights.bold,
    color: token.colorText,
    marginBottom: token.marginXS,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: token.fontSizeLG,
    color: token.colorTextSecondary,
    maxWidth: 400,
  };

  const featureListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: token.marginSM,
    textAlign: 'left',
    backgroundColor: token.colorBgContainer,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadius,
    padding: token.paddingLG,
    width: '100%',
    maxWidth: 400,
  };

  const featureItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginSM,
    fontSize: token.fontSize,
    color: token.colorText,
  };

  const renderApproved = () => (
    <>
      <SuccessAnimation size={120} />
      
      <div>
        <h1 style={titleStyle}>Verification Complete!</h1>
        <p style={subtitleStyle}>
          Your identity has been verified. You now have full access to all trading features.
        </p>
      </div>

      <div style={featureListStyle}>
        <h4 style={{ fontSize: token.fontSize, fontWeight: fontWeights.semibold, color: token.colorText, marginBottom: token.marginXS }}>
          What you can do now:
        </h4>
        {[
          'Buy & sell cryptocurrencies',
          'Deposit and withdraw funds',
          'Access P2P marketplace',
          'Trade with higher limits',
        ].map((feature, index) => (
          <div key={index} style={featureItemStyle}>
            <CheckCircleOutlined style={{ color: token.colorSuccess }} />
            {feature}
          </div>
        ))}
      </div>

      <Button
        type="primary"
        size="large"
        onClick={() => router.replace('/overview')}
        style={{
          width: '100%',
          maxWidth: 400,
          height: token.controlHeightLG,
          fontSize: token.fontSizeLG,
          fontWeight: fontWeights.semibold,
          borderRadius: token.borderRadius,
        }}
      >
        Go to Dashboard <ArrowRightOutlined />
      </Button>
    </>
  );

  const renderPending = () => (
    <>
      <LoadingAnimation size={100} text="" />
      
      <div>
        <h1 style={titleStyle}>Verification in Progress</h1>
        <p style={subtitleStyle}>
          We&apos;re reviewing your documents. This usually takes just a few minutes, but can take up to 24 hours in some cases.
        </p>
      </div>

      <div
        style={{
          backgroundColor: token.colorPrimaryBg,
          border: `1px solid ${token.colorPrimaryBorder}`,
          borderRadius: token.borderRadius,
          padding: token.paddingLG,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <ClockCircleOutlined style={{ fontSize: token.fontSizeXL, color: token.colorPrimary, marginBottom: token.marginSM }} />
        <p style={{ fontSize: token.fontSize, color: token.colorText, margin: 0 }}>
          We&apos;ll send you an email notification when the review is complete.
        </p>
      </div>

      <Button
        type="default"
        size="large"
        icon={<ReloadOutlined />}
        onClick={() => window.location.reload()}
        style={{
          height: token.controlHeightLG,
          fontSize: token.fontSize,
          fontWeight: fontWeights.medium,
          borderRadius: token.borderRadius,
        }}
      >
        Refresh Status
      </Button>
    </>
  );

  const renderRejected = () => (
    <>
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: `${token.colorError}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CloseCircleOutlined style={{ fontSize: 60, color: token.colorError }} />
      </div>
      
      <div>
        <h1 style={titleStyle}>Verification Unsuccessful</h1>
        <p style={subtitleStyle}>
          Unfortunately, we couldn&apos;t verify your identity. Don&apos;t worry - you can try again.
        </p>
      </div>

      {rejectReason && (
        <Alert
          type="warning"
          message="Reason"
          description={rejectReason}
          showIcon
          style={{ width: '100%', maxWidth: 400, textAlign: 'left' }}
        />
      )}

      <div style={featureListStyle}>
        <h4 style={{ fontSize: token.fontSize, fontWeight: fontWeights.semibold, color: token.colorText, marginBottom: token.marginXS }}>
          Tips for your next attempt:
        </h4>
        {[
          'Use a valid, unexpired ID document',
          'Ensure good lighting and clear photos',
          'Make sure all text is readable',
          'Match the name on your ID to your account',
        ].map((tip, index) => (
          <div key={index} style={featureItemStyle}>
            <CheckCircleOutlined style={{ color: token.colorPrimary }} />
            {tip}
          </div>
        ))}
      </div>

      <Button
        type="primary"
        size="large"
        onClick={() => router.push('/onboarding/verify')}
        style={{
          width: '100%',
          maxWidth: 400,
          height: token.controlHeightLG,
          fontSize: token.fontSizeLG,
          fontWeight: fontWeights.semibold,
          borderRadius: token.borderRadius,
        }}
      >
        <ReloadOutlined /> Try Again
      </Button>
    </>
  );

  const renderLoading = () => (
    <div style={{ padding: token.paddingXL }}>
      <Skeleton active avatar={{ shape: 'circle', size: 120 }} paragraph={{ rows: 3 }} />
    </div>
  );

  const renderError = () => (
    <>
      <Alert
        type="error"
        message="Something went wrong"
        description="We couldn't load your verification status. Please try again."
        showIcon
        style={{ maxWidth: 400 }}
      />
      <Button
        type="primary"
        icon={<ReloadOutlined />}
        onClick={() => window.location.reload()}
      >
        Refresh
      </Button>
    </>
  );

  return (
    <>
      <Head>
        <title>Verification Status - InTuition Exchange</title>
        <meta name="description" content="Check your identity verification status" />
      </Head>

      <OnboardingLayout currentStep={3}>
        <div style={containerStyle}>
          {status === 'loading' && renderLoading()}
          {status === 'approved' && renderApproved()}
          {status === 'pending' && renderPending()}
          {status === 'rejected' && renderRejected()}
          {status === 'error' && renderError()}
        </div>
      </OnboardingLayout>
    </>
  );
}

