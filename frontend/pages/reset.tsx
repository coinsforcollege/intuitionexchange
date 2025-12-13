/**
 * Reset Password Page
 * Multi-step password reset flow
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Form, Input, Typography, message, theme, Steps } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import AuthLayout from '@/components/auth/AuthLayout';
import LoadingButton from '@/components/auth/LoadingButton';
import OTPInput from '@/components/auth/OTPInput';
import {
  requestPasswordReset,
  verifyPasswordResetOtp,
  setNewPassword,
  resendEmailOtp,
  ApiError,
} from '@/services/api/auth';
import { fontWeights } from '@/theme/themeConfig';

const { Text, Title } = Typography;
const { useToken } = theme;

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useToken();
  const [form] = Form.useForm();
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleEmailSubmit = async (values: { email: string }) => {
    setLoading(true);
    try {
      await requestPasswordReset({ email: values.email });
      setEmail(values.email);
      setStep('otp');
      setResendCooldown(60);
      message.success('Reset code sent to your email');
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      message.error('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      await verifyPasswordResetOtp({ email, otp });
      setStep('password');
      message.success('Code verified successfully');
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (values: { password: string }) => {
    setLoading(true);
    try {
      await setNewPassword({
        email,
        otp,
        newPassword: values.password,
      });
      setStep('success');
      message.success('Password reset successfully!');
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendEmailOtp(email, 'RESET');
      setResendCooldown(60);
      message.success('Reset code resent');
    } catch {
      message.error('Failed to resend code');
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

  const backButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginXS,
    color: token.colorTextSecondary,
    fontSize: token.fontSize,
    cursor: 'pointer',
    marginBottom: token.marginLG,
  };

  const bottomTextStyle: React.CSSProperties = {
    color: token.colorTextSecondary,
    fontSize: token.fontSize,
    textAlign: 'center',
    display: 'block',
    marginTop: token.marginLG,
  };

  const resendStyle: React.CSSProperties = {
    fontSize: token.fontSize,
    color: resendCooldown > 0 ? token.colorTextDisabled : token.colorPrimary,
    cursor: resendCooldown > 0 ? 'default' : 'pointer',
    marginTop: token.marginSM,
    textAlign: 'center',
    display: 'block',
  };

  const successContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: `${token.paddingLG}px 0`,
  };

  const successIconStyle: React.CSSProperties = {
    fontSize: 64,
    color: token.colorSuccess,
    marginBottom: token.marginLG,
  };

  const successTitleStyle: React.CSSProperties = {
    fontSize: token.fontSizeHeading3,
    fontWeight: fontWeights.bold,
    color: token.colorText,
    marginBottom: token.marginSM,
  };

  const successTextStyle: React.CSSProperties = {
    fontSize: token.fontSizeLG,
    color: token.colorTextSecondary,
    marginBottom: token.marginXL,
    display: 'block',
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

  const getCurrentStep = () => {
    switch (step) {
      case 'email':
        return 0;
      case 'otp':
        return 1;
      case 'password':
        return 2;
      case 'success':
        return 3;
      default:
        return 0;
    }
  };

  const getTitle = () => {
    switch (step) {
      case 'email':
        return 'Reset Password';
      case 'otp':
        return 'Enter Code';
      case 'password':
        return 'New Password';
      case 'success':
        return 'All Done!';
      default:
        return 'Reset Password';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'email':
        return 'Enter your email to receive a reset code';
      case 'otp':
        return `We've sent a 6-digit code to ${email}`;
      case 'password':
        return 'Create a strong new password for your account';
      case 'success':
        return '';
      default:
        return '';
    }
  };

  // Success Step
  if (step === 'success') {
    return (
      <>
        <Head>
          <title>Password Reset Successful - InTuition Exchange</title>
        </Head>

        <AuthLayout title="" showBackToHome={false}>
          <div style={successContainerStyle}>
            <CheckCircleFilled style={successIconStyle} />
            <Title level={3} style={successTitleStyle}>
              Password Reset Successful
            </Title>
            <Text style={successTextStyle}>
              Your password has been updated. You can now sign in with your new password.
            </Text>
            <LoadingButton onClick={() => router.push('/login')}>
              Sign In Now
            </LoadingButton>
          </div>
        </AuthLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{getTitle()} - InTuition Exchange</title>
      </Head>

      <AuthLayout title={getTitle()} subtitle={getSubtitle()}>
        {/* Progress Steps */}
        <Steps
          current={getCurrentStep()}
          size="small"
          style={{ marginBottom: token.marginLG }}
          items={[
            { title: 'Email' },
            { title: 'Verify' },
            { title: 'Password' },
          ]}
        />

        {/* Email Step */}
        {step === 'email' && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEmailSubmit}
            requiredMark={false}
            size="large"
          >
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

            <Form.Item style={{ marginBottom: token.marginMD }}>
              <LoadingButton loading={loading} htmlType="submit">
                Send Reset Code
              </LoadingButton>
            </Form.Item>

            <Text style={bottomTextStyle}>
              Remember your password?{' '}
              <Link href="/login" style={linkStyle}>
                Sign In
              </Link>
            </Text>
          </Form>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <>
            <div style={backButtonStyle} onClick={() => setStep('email')}>
              <ArrowLeftOutlined />
              Change email
            </div>

            <div style={{ marginBottom: token.marginLG }}>
              <OTPInput
                value={otp}
                onChange={setOtp}
                disabled={loading}
              />
              <Text style={resendStyle} onClick={handleResend}>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
              </Text>
            </div>

            <LoadingButton
              loading={loading}
              onClick={handleOtpSubmit}
              disabled={otp.length !== 6}
            >
              Verify Code
            </LoadingButton>
          </>
        )}

        {/* Password Step */}
        {step === 'password' && (
          <Form
            layout="vertical"
            onFinish={handlePasswordSubmit}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="password"
              label={<span style={labelStyle}>New Password</span>}
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
                placeholder="Create a strong password"
                style={inputStyle}
                autoComplete="new-password"
                disabled={loading}
              />
            </Form.Item>

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
                placeholder="Confirm your password"
                style={inputStyle}
                autoComplete="new-password"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item>
              <LoadingButton loading={loading} htmlType="submit">
                Reset Password
              </LoadingButton>
            </Form.Item>
          </Form>
        )}
      </AuthLayout>
    </>
  );
}

