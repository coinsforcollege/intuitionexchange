/**
 * Login Page
 * Two-column layout: marketing content (left) + form (right)
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { Form, Input, Checkbox, Typography, message, theme, Divider, Row, Col } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import LoadingButton from '@/components/auth/LoadingButton';
import AuthHeader from '@/components/auth/AuthHeader';
import { loginUser, LoginData, ApiError } from '@/services/api/auth';
import { useAuth } from '@/context/AuthContext';
import { fontWeights } from '@/theme/themeConfig';

const { Text, Title } = Typography;
const { useToken } = theme;

// Layout constants
const MOBILE_BREAKPOINT = 768;

export default function LoginPage() {
  const router = useRouter();
  const { token } = useToken();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: LoginData) => {
    setLoading(true);
    try {
      const response = await loginUser({
        email: values.email,
        password: values.password,
        remember: values.remember,
      });

      login(response.user);
      message.success('Welcome back!');
      
      const redirectTo = (router.query.redirect as string) || '/wallet';
      router.push(redirectTo);
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Feature items for left panel
  const features = [
    { icon: <SafetyCertificateOutlined />, title: 'Bank-Grade Security', desc: 'Your assets are protected with institutional-level security' },
    { icon: <ThunderboltOutlined />, title: 'Instant Trading', desc: 'Execute trades in milliseconds with zero downtime' },
    { icon: <GlobalOutlined />, title: 'Global Access', desc: 'Trade College Coins from anywhere in the world' },
    { icon: <CustomerServiceOutlined />, title: '24/7 Support', desc: 'Get help anytime from our dedicated support team' },
  ];

  // Styles
  const inputStyle: React.CSSProperties = {
    height: token.controlHeightLG,
    fontSize: token.fontSize,
    borderRadius: token.borderRadius,
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: fontWeights.medium,
    fontSize: token.fontSize,
  };

  const linkStyle: React.CSSProperties = {
    color: token.colorPrimary,
    fontWeight: fontWeights.medium,
    textDecoration: 'none',
  };

  const pageContainerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: token.colorBgLayout,
  };

  const leftPanelStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)`,
    minHeight: '100vh',
    padding: token.paddingXL,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const leftPanelOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)`,
    pointerEvents: 'none',
  };

  const leftContentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    maxWidth: 480,
  };

  const leftLogoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginSM,
    marginBottom: token.marginXL,
    textDecoration: 'none',
  };

  const leftTitleStyle: React.CSSProperties = {
    color: '#ffffff',
    fontSize: token.fontSizeHeading1,
    fontWeight: fontWeights.bold,
    marginBottom: token.marginMD,
    lineHeight: 1.2,
  };

  const leftSubtitleStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.85)',
    fontSize: token.fontSizeLG,
    marginBottom: token.marginXL,
    lineHeight: 1.6,
  };

  const featureItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: token.marginMD,
    marginBottom: token.marginLG,
  };

  const featureIconStyle: React.CSSProperties = {
    width: token.controlHeightLG,
    height: token.controlHeightLG,
    borderRadius: token.borderRadius,
    backgroundColor: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: token.fontSizeHeading4,
    color: '#ffffff',
    flexShrink: 0,
  };

  const featureTitleStyle: React.CSSProperties = {
    color: '#ffffff',
    fontSize: token.fontSize,
    fontWeight: fontWeights.semibold,
    marginBottom: token.marginXXS,
  };

  const featureDescStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.7)',
    fontSize: token.fontSize,
    lineHeight: 1.5,
  };

  const rightPanelStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: token.colorBgContainer,
  };

  const formContainerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 440,
    margin: '0 auto',
    padding: token.paddingLG,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const formHeaderStyle: React.CSSProperties = {
    marginBottom: token.marginLG,
  };

  const formTitleStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading2,
    fontWeight: fontWeights.bold,
    color: token.colorText,
    marginBottom: token.marginXS,
  };

  const formSubtitleStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    color: token.colorTextSecondary,
  };

  const bottomTextStyle: React.CSSProperties = {
    color: token.colorTextSecondary,
    fontSize: token.fontSize,
    textAlign: 'center',
    display: 'block',
    marginTop: token.marginLG,
  };

  return (
    <>
      <Head>
        <title>Login - InTuition Exchange</title>
        <meta name="description" content="Login to your InTuition Exchange account" />
      </Head>

      <div style={pageContainerStyle}>
        <Row style={{ minHeight: '100vh' }}>
          {/* Left Panel - Marketing Content (hidden on mobile) */}
          <Col xs={0} md={10} lg={10} xl={12}>
            <div style={leftPanelStyle}>
              <div style={leftPanelOverlayStyle} />
              <div style={leftContentStyle}>
                {/* Logo */}
                <Link href="/" style={leftLogoStyle}>
                  <div style={{
                    width: token.controlHeightLG,
                    height: token.controlHeightLG,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: token.borderRadiusSM,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Image
                      src="/images/intuition-logo-no-text.svg"
                      alt="InTuition"
                      width={28}
                      height={28}
                    />
                  </div>
                  <span style={{ color: '#ffffff', fontSize: token.fontSizeHeading4, fontWeight: fontWeights.bold }}>
                    InTuition
                  </span>
                </Link>

                {/* Headline */}
                <h1 style={leftTitleStyle}>
                  Welcome Back to InTuition
                </h1>
                <p style={leftSubtitleStyle}>
                  Access your wallet, track your portfolio, and continue trading College Coins with confidence.
                </p>

                {/* Features */}
                {features.map((feature, index) => (
                  <div key={index} style={featureItemStyle}>
                    <div style={featureIconStyle}>{feature.icon}</div>
                    <div>
                      <div style={featureTitleStyle}>{feature.title}</div>
                      <div style={featureDescStyle}>{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Right Panel - Form */}
          <Col xs={24} md={14} lg={14} xl={12}>
            <div style={rightPanelStyle}>
              {/* Mobile header with state-aware auth link */}
              <div className="mobile-auth-header">
                <AuthHeader />
              </div>

              <div style={formContainerStyle}>
                <div style={formHeaderStyle}>
                  <Title level={2} style={formTitleStyle}>Welcome Back</Title>
                  <Text style={formSubtitleStyle}>Login to access your wallet and start trading</Text>
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  requiredMark={false}
                  size="large"
                  className="login-form"
                >
                  {/* Email Field */}
                  <Form.Item
                    name="email"
                    label={<span style={labelStyle}>Email Address</span>}
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined style={{ color: token.colorTextSecondary }} />}
                      placeholder="you@example.com"
                      style={inputStyle}
                      autoComplete="email"
                      disabled={loading}
                    />
                  </Form.Item>

                  {/* Password Field */}
                  <Form.Item
                    name="password"
                    label={<span style={labelStyle}>Password</span>}
                    rules={[
                      { required: true, message: 'Please enter your password' },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined style={{ color: token.colorTextSecondary }} />}
                      suffix={
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: 'pointer', color: token.colorTextSecondary }}
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </span>
                      }
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      style={inputStyle}
                      autoComplete="current-password"
                      disabled={loading}
                    />
                  </Form.Item>

                  {/* Remember Me & Forgot Password */}
                  <Form.Item style={{ marginBottom: token.marginLG }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox disabled={loading}>
                          <span style={{ color: token.colorText, fontSize: token.fontSize }}>
                            Remember me
                          </span>
                        </Checkbox>
                      </Form.Item>
                      <Link href="/reset" style={linkStyle}>
                        Forgot password?
                      </Link>
                    </div>
                  </Form.Item>

                  {/* Submit Button */}
                  <Form.Item style={{ marginBottom: token.marginMD }}>
                    <LoadingButton loading={loading} htmlType="submit">
                      Sign In
                    </LoadingButton>
                  </Form.Item>

                  {/* Sign Up Link - hidden on mobile (shown in header) */}
                  <div className="desktop-signup-link">
                    <Divider>
                      <span style={{ color: token.colorTextSecondary, fontSize: token.fontSize }}>or</span>
                    </Divider>
                    <Text style={bottomTextStyle}>
                      Don&apos;t have an account?{' '}
                      <Link href="/register" style={linkStyle}>
                        Create Account
                      </Link>
                    </Text>
                  </div>
                </Form>
              </div>

              {/* Back to home link */}
              <div style={{ 
                textAlign: 'center', 
                padding: token.paddingLG,
              }}>
                <Link href="/" style={{ color: token.colorTextSecondary, fontSize: token.fontSize }}>
                  ← Back to Home
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <style jsx global>{`
        @media (min-width: ${MOBILE_BREAKPOINT}px) {
          .mobile-auth-header {
            display: none !important;
          }
        }
        @media (max-width: ${MOBILE_BREAKPOINT - 1}px) {
          .desktop-signup-link {
            display: none !important;
          }
        }
        /* Tighter form spacing */
        .login-form .ant-form-item {
          margin-bottom: ${token.marginSM}px;
        }
        .login-form .ant-form-item-label {
          padding-bottom: ${token.paddingXXS}px;
        }
      `}</style>
    </>
  );
}
