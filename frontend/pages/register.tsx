/**
 * Register Page
 * Multi-step registration with OTP verification
 * Two-column layout: marketing content (left) + form (right)
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { Form, Input, Select, Typography, message, theme, Divider, Row, Col, Space } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import LoadingButton from '@/components/auth/LoadingButton';
import OTPInput from '@/components/auth/OTPInput';
import AuthHeader from '@/components/auth/AuthHeader';
import {
  registerUser,
  verifyRegistration,
  resendEmailOtp,
  resendPhoneOtp,
  RegisterData,
  ApiError,
} from '@/services/api/auth';
import { fontWeights } from '@/theme/themeConfig';
import { getCountryOptions, getPhoneCodeOptions } from '@/data/countries';

const { Text, Title } = Typography;
const { useToken } = theme;

// Layout constants
const MOBILE_BREAKPOINT = 768;

// Get options from countries data
const countryOptions = getCountryOptions();
const phoneCodeOptions = getPhoneCodeOptions();

// Custom filter that matches from the start of words
const filterFromStart = (input: string, option?: { searchValue?: string }) => {
  if (!option?.searchValue) return false;
  const searchLower = input.toLowerCase();
  const words = option.searchValue.toLowerCase().split(' ');
  // Match if any word starts with the search input
  return words.some(word => word.startsWith(searchLower));
};

type Step = 'form' | 'otp';

export default function RegisterPage() {
  const router = useRouter();
  const { token } = useToken();
  const [form] = Form.useForm();
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterData | null>(null);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPhone, setOtpPhone] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleFormSubmit = async (values: RegisterData & { confirmPassword: string }) => {
    setLoading(true);
    try {
      const data: RegisterData = {
        email: values.email,
        phone: values.phone,
        phoneCountry: values.phoneCountry,
        password: values.password,
        country: values.country,
      };

      await registerUser(data);
      setFormData(data);
      setStep('otp');
      setResendCooldown(60);
      message.success('Verification codes sent to your email and phone');
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!formData) return;
    if (otpEmail.length !== 6 || otpPhone.length !== 6) {
      message.error('Please enter both 6-digit verification codes');
      return;
    }

    setLoading(true);
    try {
      await verifyRegistration({
        ...formData,
        otpEmail,
        otpPhone,
      });

      message.success('Account created successfully!');
      router.push('/login?registered=true');
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!formData || resendCooldown > 0) return;
    try {
      await resendEmailOtp(formData.email, 'REGISTER');
      setResendCooldown(60);
      message.success('Email OTP resent');
    } catch {
      message.error('Failed to resend email OTP');
    }
  };

  const handleResendPhone = async () => {
    if (!formData || resendCooldown > 0) return;
    try {
      await resendPhoneOtp(formData.phone, formData.phoneCountry, 'REGISTER');
      setResendCooldown(60);
      message.success('Phone OTP resent');
    } catch {
      message.error('Failed to resend phone OTP');
    }
  };

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

  const bottomTextStyle: React.CSSProperties = {
    color: token.colorTextSecondary,
    fontSize: token.fontSize,
    textAlign: 'center',
    display: 'block',
    marginTop: token.marginLG,
  };

  const otpSectionStyle: React.CSSProperties = {
    marginBottom: token.marginLG,
  };

  const otpLabelStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    fontWeight: fontWeights.medium,
    color: token.colorText,
    marginBottom: token.marginSM,
    display: 'block',
  };

  const resendStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    color: resendCooldown > 0 ? token.colorTextDisabled : token.colorPrimary,
    cursor: resendCooldown > 0 ? 'default' : 'pointer',
    marginTop: token.marginXS,
    textAlign: 'center',
    display: 'block',
  };

  const backButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginXS,
    color: token.colorTextSecondary,
    fontSize: token.fontSize,
    cursor: 'pointer',
    marginBottom: token.marginLG,
  };

  // Password validation rules
  const passwordRules = [
    { required: true, message: 'Please enter a password' },
    { min: 8, message: 'Password must be at least 8 characters' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      message: 'Must include uppercase, lowercase, number, and special character',
    },
  ];

  // Feature items for left panel
  const features = [
    { icon: <SafetyCertificateOutlined />, title: 'Bank-Grade Security', desc: 'Your assets are protected with institutional-level security' },
    { icon: <ThunderboltOutlined />, title: 'Instant Trading', desc: 'Execute trades in milliseconds with zero downtime' },
    { icon: <GlobalOutlined />, title: 'Global Access', desc: 'Trade College Coins from anywhere in the world' },
    { icon: <CustomerServiceOutlined />, title: '24/7 Support', desc: 'Get help anytime from our dedicated support team' },
  ];

  // Styles for left panel
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

  // Styles for right panel (form)
  const rightPanelStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: token.colorBgContainer,
  };

  const formContainerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 520,
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

  // OTP step content
  const renderOtpStep = () => (
    <div style={formContainerStyle}>
      <div style={backButtonStyle} onClick={() => setStep('form')}>
        <ArrowLeftOutlined />
        Back to form
      </div>

      <div style={formHeaderStyle}>
        <Title level={2} style={formTitleStyle}>Verify Your Account</Title>
        <Text style={formSubtitleStyle}>
          We&apos;ve sent verification codes to {formData?.email} and your phone
        </Text>
      </div>

      {/* Email OTP */}
      <div style={otpSectionStyle}>
        <Text style={otpLabelStyle}>Email Verification Code</Text>
        <OTPInput
          value={otpEmail}
          onChange={setOtpEmail}
          disabled={loading}
        />
        <Text style={resendStyle} onClick={handleResendEmail}>
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
        </Text>
      </div>

      {/* Phone OTP */}
      <div style={otpSectionStyle}>
        <Text style={otpLabelStyle}>Phone Verification Code</Text>
        <OTPInput
          value={otpPhone}
          onChange={setOtpPhone}
          disabled={loading}
        />
        <Text style={resendStyle} onClick={handleResendPhone}>
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
        </Text>
      </div>

      <LoadingButton
        loading={loading}
        onClick={handleOtpSubmit}
        disabled={otpEmail.length !== 6 || otpPhone.length !== 6}
      >
        Verify & Create Account
      </LoadingButton>
    </div>
  );

  // Form step content
  const renderFormStep = () => (
    <div style={formContainerStyle}>
      <div style={formHeaderStyle}>
        <Title level={2} style={formTitleStyle}>Create Account</Title>
        <Text style={formSubtitleStyle}>Start your College Coins journey today</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        requiredMark={false}
        size="large"
        initialValues={{ phoneCountry: '1', country: 'US' }}
        className="register-form"
      >
        {/* Email & Country - 2 columns on desktop */}
        <Row gutter={token.marginMD}>
          <Col xs={24} md={12}>
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
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="country"
              label={<span style={labelStyle}>Country of Residence</span>}
              rules={[{ required: true, message: 'Please select your country' }]}
            >
              <Select
                showSearch
                placeholder="Select country"
                options={countryOptions}
                disabled={loading}
                filterOption={filterFromStart}
                style={{ height: token.controlHeightLG }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Phone - compact grouped field 40/60 split */}
        <Form.Item
          label={<span style={labelStyle}>Phone Number</span>}
          required
        >
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              name="phoneCountry"
              noStyle
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                style={{ width: '40%' }}
                options={phoneCodeOptions}
                disabled={loading}
                filterOption={filterFromStart}
                popupMatchSelectWidth={240}
              />
            </Form.Item>
            <Form.Item
              name="phone"
              noStyle
              rules={[
                { required: true, message: 'Please enter your phone number' },
                { pattern: /^\d{7,15}$/, message: 'Enter valid phone number' },
              ]}
            >
              <Input
                style={{ width: '60%', height: token.controlHeightLG }}
                placeholder="Phone number"
                autoComplete="tel"
                disabled={loading}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        {/* Password & Confirm - 2 columns on desktop */}
        <Row gutter={token.marginMD}>
          <Col xs={24} md={12}>
            <Form.Item
              name="password"
              label={<span style={labelStyle}>Password</span>}
              rules={passwordRules}
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
                placeholder="Create password"
                style={inputStyle}
                autoComplete="new-password"
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="confirmPassword"
              label={<span style={labelStyle}>Confirm Password</span>}
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input
                prefix={<LockOutlined style={{ color: token.colorTextSecondary }} />}
                type="password"
                placeholder="Confirm password"
                style={inputStyle}
                autoComplete="new-password"
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <Form.Item style={{ marginBottom: token.marginMD }}>
          <LoadingButton loading={loading} htmlType="submit">
            Create Account
          </LoadingButton>
        </Form.Item>

          {/* Login Link - hidden on mobile (shown in header) */}
          <div className="desktop-login-link">
            <Divider>
              <span style={{ color: token.colorTextSecondary, fontSize: token.fontSize }}>or</span>
            </Divider>
            <Text style={bottomTextStyle}>
              Already have an account?{' '}
              <Link href="/login" style={linkStyle}>
                Sign In
              </Link>
            </Text>
          </div>
      </Form>
    </div>
  );

  return (
    <>
      <Head>
        <title>{step === 'otp' ? 'Verify Your Account' : 'Create Account'} - InTuition Exchange</title>
        <meta name="description" content="Create your InTuition Exchange account" />
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
                    position: 'relative',
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
                  Trade College Coins with Confidence
                </h1>
                <p style={leftSubtitleStyle}>
                  Join thousands of students and institutions trading TUIT tokens on the most trusted College Coins exchange.
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

              {step === 'otp' ? renderOtpStep() : renderFormStep()}

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
          .desktop-login-link {
            display: none !important;
          }
        }
        /* Tighter form spacing */
        .register-form .ant-form-item {
          margin-bottom: ${token.marginSM}px;
        }
        .register-form .ant-form-item-label {
          padding-bottom: ${token.paddingXXS}px;
        }
        /* No margin on checkbox items */
        .register-form .ant-form-item-checkbox {
          margin-bottom: ${token.marginXXS}px;
        }
      `}</style>
    </>
  );
}

