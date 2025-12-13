import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button, message, theme, Alert } from 'antd';
import { CameraOutlined, IdcardOutlined, BulbOutlined, ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import LoadingAnimation from '@/components/onboarding/animations/LoadingAnimation';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { createVeriffSession, checkVeriffDecision, ApiError } from '@/services/api/onboarding';

const { useToken } = theme;

type VerifyState = 'prepare' | 'loading' | 'verifying' | 'processing' | 'error';

const tips = [
  { icon: <CameraOutlined />, text: 'Good lighting - find a well-lit area' },
  { icon: <IdcardOutlined />, text: 'Have your valid ID ready' },
  { icon: <BulbOutlined />, text: 'Remove glasses and hats for the selfie' },
];

export default function VerifyPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user } = useAuth();
  const [state, setState] = useState<VerifyState>('prepare');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isAnimated, setIsAnimated] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/onboarding');
      return;
    }
  }, [user, router]);

  // Poll for decision when in processing state
  useEffect(() => {
    if (state !== 'processing') return;

    const pollInterval = setInterval(async () => {
      try {
        const decision = await checkVeriffDecision();
        
        if (decision.status === 'APPROVED') {
          clearInterval(pollInterval);
          message.success('Verification approved!');
          router.push('/onboarding/status');
        } else if (decision.status === 'REJECTED') {
          clearInterval(pollInterval);
          message.error('Verification was not successful');
          router.push('/onboarding/status');
        } else if (pollingCount >= 60) {
          // Stop polling after ~5 minutes (60 * 5 seconds)
          clearInterval(pollInterval);
          router.push('/onboarding/status');
        }
        
        setPollingCount((prev) => prev + 1);
      } catch {
        // Continue polling on error
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [state, pollingCount, router]);

  const startVerification = async () => {
    setState('loading');
    setErrorMessage('');

    try {
      const sessionData = await createVeriffSession();

      // For now, use direct URL approach until Veriff SDK is installed
      // Once @veriff/js-sdk is installed, we can use the embedded flow
      if (sessionData.sessionUrl) {
        // Open Veriff in a new tab
        window.open(sessionData.sessionUrl, '_blank');
        setState('processing');
        message.info('Complete verification in the new tab');
      } else {
        // Fallback: Use the session URL from backend
        // Load Veriff SDK dynamically (requires @veriff/js-sdk package)
        try {
          const VeriffModule = await import('@veriff/js-sdk');
          const Veriff = VeriffModule.default || VeriffModule.Veriff;
          
          const veriff = Veriff({
            host: 'https://stationapi.veriff.com',
            apiKey: process.env.NEXT_PUBLIC_VERIFF_API_KEY || '704623a5-fd1c-4b51-aa07-af8af6921931',
            parentId: 'veriff-root',
            onSession: (err: Error | null) => {
              if (err) {
                console.error('Veriff session error:', err);
                setErrorMessage('Failed to start verification. Please try again.');
                setState('error');
                return;
              }
              setState('verifying');
            },
          });

          veriff.setParams({
            vendorData: user?.id || '',
          });

          veriff.mount({
            formLabel: {
              vendorData: 'User ID',
            },
          });

          // Create an event listener for Veriff messages
          const handleVeriffMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://stationapi.veriff.com') return;

            const { msg } = event.data || {};
            
            if (msg === 'FINISHED') {
              setState('processing');
            } else if (msg === 'CANCELED') {
              setState('prepare');
              message.info('Verification cancelled. You can try again when ready.');
            }
          };

          window.addEventListener('message', handleVeriffMessage);
        } catch {
          // SDK not installed, fall back to URL approach
          setErrorMessage('Verification SDK not available. Please contact support.');
          setState('error');
        }
      }

    } catch (error) {
      const apiError = error as ApiError;
      setErrorMessage(apiError.message || 'Failed to start verification. Please try again.');
      setState('error');
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: token.marginLG,
    opacity: isAnimated ? 1 : 0,
    transform: `translateY(${isAnimated ? 0 : 20}px)`,
    transition: 'all 0.5s ease-out',
  };

  const tipCardStyle: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadius,
    padding: token.paddingMD,
    display: 'flex',
    alignItems: 'center',
    gap: token.marginMD,
    width: '100%',
    maxWidth: 400,
  };

  const tipIconStyle: React.CSSProperties = {
    fontSize: token.fontSizeXL,
    color: token.colorPrimary,
    flexShrink: 0,
  };

  const tipTextStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    color: token.colorText,
  };

  const backButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginXS,
    color: token.colorTextSecondary,
    fontSize: token.fontSize,
    cursor: 'pointer',
    marginBottom: token.marginMD,
  };

  const renderPrepare = () => (
    <>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={backButtonStyle} onClick={() => router.push('/onboarding/address')}>
          <ArrowLeftOutlined />
          Back to Address
        </div>
      </div>

      {/* Tips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: token.marginSM, width: '100%', maxWidth: 400 }}>
        <h3 style={{ fontSize: token.fontSizeLG, fontWeight: fontWeights.semibold, color: token.colorText, marginBottom: token.marginSM }}>
          Before you start
        </h3>
        {tips.map((tip, index) => (
          <div key={index} style={tipCardStyle}>
            <span style={tipIconStyle}>{tip.icon}</span>
            <span style={tipTextStyle}>{tip.text}</span>
          </div>
        ))}
      </div>

      {/* Veriff container */}
      <div id="veriff-root" style={{ width: '100%', maxWidth: 400 }} />

      {/* Start Button */}
      <Button
        type="primary"
        size="large"
        onClick={startVerification}
        style={{
          width: '100%',
          maxWidth: 400,
          height: token.controlHeightLG,
          fontSize: token.fontSizeLG,
          fontWeight: fontWeights.semibold,
          borderRadius: token.borderRadius,
        }}
      >
        <CameraOutlined /> Start Verification
      </Button>

      <p style={{ fontSize: token.fontSize, color: token.colorTextSecondary, textAlign: 'center', maxWidth: 350 }}>
        You&apos;ll be asked to take a photo of your ID and a selfie. This usually takes about 2 minutes.
      </p>
    </>
  );

  const renderLoading = () => (
    <div style={{ padding: token.paddingXL, textAlign: 'center' }}>
      <LoadingAnimation text="Starting verification..." />
    </div>
  );

  const renderVerifying = () => (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div id="veriff-root" style={{ width: '100%', minHeight: 400 }} />
      <p style={{ fontSize: token.fontSize, color: token.colorTextSecondary, marginTop: token.marginLG }}>
        Complete the verification in the window above
      </p>
    </div>
  );

  const renderProcessing = () => (
    <div style={{ padding: token.paddingXL, textAlign: 'center' }}>
      <LoadingAnimation size={100} text="Processing your verification..." />
      <p style={{ fontSize: token.fontSize, color: token.colorTextSecondary, marginTop: token.marginXL, maxWidth: 350, margin: `${token.marginXL}px auto 0` }}>
        This usually takes less than a minute. You can wait here or check back later.
      </p>
      <Button
        type="link"
        onClick={() => router.push('/onboarding/status')}
        style={{ marginTop: token.marginMD }}
      >
        Check status later →
      </Button>
    </div>
  );

  const renderError = () => (
    <div style={{ textAlign: 'center', padding: token.paddingXL }}>
      <Alert
        type="error"
        message="Verification Error"
        description={errorMessage}
        showIcon
        style={{ marginBottom: token.marginLG, maxWidth: 400 }}
      />
      <Button
        type="primary"
        icon={<ReloadOutlined />}
        onClick={() => {
          setState('prepare');
          setErrorMessage('');
        }}
        style={{
          height: token.controlHeightLG,
          fontSize: token.fontSize,
          fontWeight: fontWeights.semibold,
          borderRadius: token.borderRadius,
        }}
      >
        Try Again
      </Button>
    </div>
  );

  return (
    <>
      <Head>
        <title>Verify Identity - InTuition Exchange</title>
        <meta name="description" content="Verify your identity with a photo ID and selfie" />
      </Head>

      <OnboardingLayout
        currentStep={2}
        title={state === 'processing' ? 'Verification in Progress' : 'Identity Verification'}
        subtitle={
          state === 'processing'
            ? "We're reviewing your documents"
            : 'Scan your ID and take a selfie to verify your identity'
        }
      >
        <div style={containerStyle}>
          {state === 'prepare' && renderPrepare()}
          {state === 'loading' && renderLoading()}
          {state === 'verifying' && renderVerifying()}
          {state === 'processing' && renderProcessing()}
          {state === 'error' && renderError()}
        </div>
      </OnboardingLayout>
    </>
  );
}

