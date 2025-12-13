'use client';

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Steps, theme, Grid } from 'antd';
import { UserOutlined, HomeOutlined, SafetyCertificateOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { fontWeights } from '@/theme/themeConfig';
import { useThemeMode } from '@/context/ThemeContext';

const { useToken } = theme;
const { useBreakpoint } = Grid;

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  title?: string;
  subtitle?: string;
}

const steps = [
  { title: 'Personal', icon: <UserOutlined /> },
  { title: 'Address', icon: <HomeOutlined /> },
  { title: 'Verify', icon: <SafetyCertificateOutlined /> },
  { title: 'Complete', icon: <CheckCircleOutlined /> },
];

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  title,
  subtitle,
}) => {
  const { token } = useToken();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const router = useRouter();
  const isMobile = !screens.md;

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: token.colorBgLayout,
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    padding: `${token.paddingMD}px ${token.paddingLG}px`,
    backgroundColor: token.colorBgContainer,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: token.zIndexPopupBase,
  };

  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginSM,
  };

  const logoTextStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading4,
    fontWeight: fontWeights.bold,
    color: token.colorText,
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: isMobile ? token.paddingMD : token.paddingXL,
    maxWidth: 600,
    width: '100%',
    margin: '0 auto',
  };

  const stepsContainerStyle: React.CSSProperties = {
    marginBottom: token.marginXL,
    padding: `${token.paddingMD}px 0`,
  };

  const headerContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: token.marginXL,
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
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={logoContainerStyle}>
            <Image
              src="/images/intuition-logo-no-text.svg"
              alt="InTuition"
              width={token.controlHeightLG}
              height={token.controlHeightLG}
            />
            <span style={logoTextStyle}>InTuition</span>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main style={mainStyle}>
        {/* Progress Steps */}
        <div style={stepsContainerStyle}>
          <Steps
            current={currentStep}
            size={isMobile ? 'small' : 'default'}
            items={steps.map((step, index) => ({
              title: isMobile ? '' : step.title,
              icon: step.icon,
              status: index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait',
            }))}
            responsive={false}
          />
        </div>

        {/* Title & Subtitle */}
        {(title || subtitle) && (
          <div style={headerContainerStyle}>
            {title && <h1 style={titleStyle}>{title}</h1>}
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          </div>
        )}

        {/* Page Content */}
        <div style={contentStyle}>{children}</div>
      </main>
    </div>
  );
};

export default OnboardingLayout;

