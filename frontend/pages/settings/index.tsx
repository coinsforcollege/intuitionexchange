'use client';

import React, { useEffect, useState, ReactElement } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  theme,
  Card,
  Typography,
  Button,
  Switch,
  Skeleton,
  message,
  Modal,
  Form,
  Input,
  Tag,
  Divider,
  Empty,
  Popconfirm,
  Collapse,
  Grid,
  Space,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  HomeOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  MobileOutlined,
  SoundOutlined,
  ExperimentOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import type { NextPageWithLayout } from '../_app';
import {
  getUserSettings,
  requestPasswordChange,
  changePassword,
  updateNotificationPreferences,
  updateAppMode,
  type UserSettings,
  type NotificationPreferences,
  type AppMode,
} from '@/services/api/settings';
import { getBankAccounts, deleteBankAccount, type BankAccount } from '@/services/api/fiat';
import { resetLearnerAccount } from '@/services/api/learner';
import { checkVeriffDecision } from '@/services/api/onboarding';
import OTPInput from '@/components/auth/OTPInput';
import dayjs from 'dayjs';
import { Country, State } from 'country-state-city';

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Title, Text, Paragraph } = Typography;

// KYC Status Badge Component
const KycStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { token } = useToken();
  
  const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    APPROVED: { color: 'success', icon: <CheckCircleOutlined />, label: 'Verified' },
    PENDING: { color: 'warning', icon: <ClockCircleOutlined />, label: 'Pending' },
    SUBMITTED: { color: 'processing', icon: <ClockCircleOutlined />, label: 'Under Review' },
    REJECTED: { color: 'error', icon: <CloseCircleOutlined />, label: 'Rejected' },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Tag color={config.color} icon={config.icon} style={{ fontSize: token.fontSize }}>
      {config.label}
    </Tag>
  );
};

// Section Card Component
const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  extra?: React.ReactNode;
  gradient?: string;
}> = ({ title, icon, children, extra, gradient }) => {
  const { token } = useToken();

  return (
    <Card
      style={{
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: token.marginMD,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: token.borderRadius,
              background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: token.fontSizeLG,
            }}
          >
            {icon}
          </div>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
        </div>
        {extra}
      </div>
      {children}
    </Card>
  );
};

// Info Row Component
const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => {
  const { token } = useToken();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${token.paddingSM}px 0`,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
        <span style={{ color: token.colorTextSecondary }}>{icon}</span>
        <Text type="secondary">{label}</Text>
      </div>
      <Text strong style={{ textAlign: 'right' }}>
        {value || '—'}
      </Text>
    </div>
  );
};

// Notification Toggle Component
const NotificationToggle: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ label, description, checked, onChange, disabled }) => {
  const { token } = useToken();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${token.paddingSM}px 0`,
      }}
    >
      <div style={{ flex: 1 }}>
        <Text style={{ fontWeight: fontWeights.medium }}>{label}</Text>
        {description && (
          <Text type="secondary" style={{ display: 'block', fontSize: token.fontSizeSM }}>
            {description}
          </Text>
        )}
      </div>
      <Switch checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
};

const SettingsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { token } = useToken();
  const screens = useBreakpoint();
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [bankAccountsLoading, setBankAccountsLoading] = useState(true);

  // Password change state
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordStep, setPasswordStep] = useState<'request' | 'verify'>('request');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // App mode: 'learner' (demo) or 'investor' (production) - now synced with database
  const [appMode, setAppMode] = useState<'learner' | 'investor'>('learner');
  const [appModeLoading, setAppModeLoading] = useState(false);

  const isMobile = mounted ? !screens.md : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/settings');
        return;
      }
      loadData();
    }
  }, [user, authLoading, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const loadData = async () => {
    setLoading(true);
    setBankAccountsLoading(true);
    try {
      const [settingsData, accountsData] = await Promise.all([
        getUserSettings(),
        getBankAccounts(),
      ]);
      
      // If KYC is pending/submitted, fetch decision from Veriff to update DB
      if (settingsData.kycStatus === 'PENDING' || settingsData.kycStatus === 'SUBMITTED') {
        try {
          const decision = await checkVeriffDecision();
          // Update local settings with fresh status
          if (decision.status !== settingsData.kycStatus) {
            settingsData.kycStatus = decision.status;
          }
        } catch {
          // Ignore errors - may not have a Veriff session yet
        }
      }
      
      setSettings(settingsData);
      setBankAccounts(accountsData);
      
      // Set app mode from database (synced across devices)
      if (settingsData.appMode) {
        const mode = settingsData.appMode.toLowerCase() as 'learner' | 'investor';
        setAppMode(mode);
        // Also sync to localStorage for ExchangeContext to pick up
        localStorage.setItem('appMode', mode);
      }
    } catch (error: any) {
      message.error('Failed to load settings');
    } finally {
      setLoading(false);
      setBankAccountsLoading(false);
    }
  };

  const handleRequestPasswordChange = async () => {
    setPasswordLoading(true);
    try {
      await requestPasswordChange();
      message.success('Verification code sent to your email');
      setPasswordStep('verify');
      setResendCooldown(60);
    } catch (error: any) {
      message.error(error.message || 'Failed to send verification code');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }
    if (otp.length !== 6) {
      message.error('Please enter the 6-digit verification code');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(otp, newPassword);
      message.success('Password changed successfully');
      setPasswordModalVisible(false);
      resetPasswordModal();
    } catch (error: any) {
      message.error(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const resetPasswordModal = () => {
    setPasswordStep('request');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    if (!settings) return;

    try {
      const updatedPrefs = await updateNotificationPreferences({ [key]: value });
      setSettings({
        ...settings,
        notificationPreferences: updatedPrefs,
      });
      message.success('Notification preference updated');
    } catch (error: any) {
      message.error('Failed to update preference');
    }
  };

  const handleDeleteBankAccount = async (accountId: string) => {
    try {
      await deleteBankAccount(accountId);
      message.success('Bank account deleted');
      setBankAccounts(bankAccounts.filter((a) => a.id !== accountId));
    } catch (error: any) {
      message.error('Failed to delete bank account');
    }
  };

  const handleAppModeChange = async (isInvestor: boolean) => {
    // Block investor mode if KYC not approved (also checked on backend)
    if (isInvestor && settings?.kycStatus !== 'APPROVED') {
      message.warning('Complete identity verification to enable Investor mode');
      return;
    }
    
    const newMode: AppMode = isInvestor ? 'INVESTOR' : 'LEARNER';
    setAppModeLoading(true);
    
    try {
      const result = await updateAppMode(newMode);
      const localMode = result.appMode.toLowerCase() as 'learner' | 'investor';
      setAppMode(localMode);
      // Sync to localStorage for ExchangeContext to pick up immediately
      localStorage.setItem('appMode', localMode);
      message.success(result.message);
      
      // Refresh user data in AuthContext so it's in sync
      refreshUser();
    } catch (error: any) {
      message.error(error.message || 'Failed to switch mode');
    } finally {
      setAppModeLoading(false);
    }
  };
  
  // Reset learner account
  const [resetLoading, setResetLoading] = useState(false);
  const handleResetLearnerAccount = async () => {
    setResetLoading(true);
    try {
      await resetLearnerAccount();
      message.success('Learner account reset! You now have $10,000 virtual balance.');
    } catch (error: any) {
      message.error(error.message || 'Failed to reset learner account');
    } finally {
      setResetLoading(false);
    }
  };

  // Format phone number with country code
  const formatPhone = () => {
    if (!settings) return '—';
    return `+${settings.phoneCountry} ${settings.phone}`;
  };

  // Get country name from code
  const getCountryName = (code: string | null) => {
    if (!code) return '—';
    const country = Country.getCountryByCode(code);
    return country ? `${country.flag} ${country.name}` : code;
  };

  // Get state name from code
  const getStateName = (countryCode: string | null, stateCode: string | null) => {
    if (!countryCode || !stateCode) return stateCode || '—';
    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    return state ? state.name : stateCode;
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return dayjs(dateString).format('MMMM D, YYYY');
  };

  // Default notification preferences
  const notificationPrefs = settings?.notificationPreferences || {
    emailMarketing: true,
    emailSecurityAlerts: true,
    emailTransactions: true,
    emailPriceAlerts: false,
    emailNewsUpdates: true,
    pushEnabled: true,
    pushSecurityAlerts: true,
    pushTransactions: true,
    pushPriceAlerts: false,
    pushNewsUpdates: false,
    smsEnabled: true,
    smsSecurityAlerts: true,
    smsTransactions: false,
  };

  // Don't render anything while checking auth or if not logged in
  if (authLoading || !user) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Settings - InTuition Exchange</title>
        </Head>
        <Skeleton active paragraph={{ rows: 12 }} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Settings - InTuition Exchange</title>
        <meta name="description" content="Manage your account settings" />
      </Head>

      <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: token.marginLG,
          }}
        >
          {/* Account Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <SectionCard
              title="Account Information"
              icon={<UserOutlined />}
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            >
              <InfoRow icon={<MailOutlined />} label="Email" value={settings?.email} />
              <InfoRow icon={<PhoneOutlined />} label="Phone" value={formatPhone()} />
              <InfoRow
                icon={<GlobalOutlined />}
                label="Country"
                value={getCountryName(settings?.country || null)}
              />
              <InfoRow
                icon={<CalendarOutlined />}
                label="Member Since"
                value={formatDate(settings?.createdAt || null)}
              />

              {/* App Mode Toggle */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: `${token.paddingMD}px 0`,
                  marginTop: token.marginSM,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
                  {!isMobile && (
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: token.borderRadiusSM,
                        background: appMode === 'investor' 
                          ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                          : 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: token.fontSizeLG,
                        transition: 'all 0.3s ease',
                        boxShadow: appMode === 'learner' 
                          ? '0 4px 12px rgba(245, 158, 11, 0.3)'
                          : '0 4px 12px rgba(17, 153, 142, 0.3)',
                      }}
                    >
                      {appMode === 'investor' ? <RocketOutlined /> : <ExperimentOutlined />}
                    </div>
                  )}
                  <div>
                    <Text style={{ fontWeight: fontWeights.medium, display: 'block' }}>
                      Trading Mode
                    </Text>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
                  <Text 
                    style={{ 
                      fontWeight: appMode === 'learner' ? fontWeights.bold : fontWeights.normal,
                      color: appMode === 'learner' ? '#F59E0B' : token.colorTextSecondary,
                      fontSize: token.fontSizeSM,
                    }}
                  >
                    Learner
                  </Text>
                  <Switch
                    checked={appMode === 'investor'}
                    onChange={handleAppModeChange}
                    className={appMode === 'learner' ? 'learner-switch' : 'investor-switch'}
                  />
                  <Text 
                    style={{ 
                      fontWeight: appMode === 'investor' ? fontWeights.bold : fontWeights.normal,
                      color: appMode === 'investor' ? '#11998e' : token.colorTextSecondary,
                      fontSize: token.fontSizeSM,
                    }}
                  >
                    Investor
                  </Text>
                </div>
              </div>
              <div 
                style={{ 
                  padding: `${token.paddingSM}px ${token.paddingMD}px`,
                  background: appMode === 'investor' 
                    ? 'rgba(17, 153, 142, 0.1)' 
                    : 'rgba(245, 158, 11, 0.1)',
                  borderRadius: token.borderRadius,
                  border: `1px solid ${appMode === 'investor' ? 'rgba(17, 153, 142, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                }}
              >
                <Text 
                  style={{ 
                    fontSize: token.fontSizeSM, 
                    display: 'block',
                    color: appMode === 'investor' ? '#11998e' : '#D97706',
                    fontWeight: fontWeights.medium,
                  }}
                >
                  {appMode === 'investor' 
                    ? '⚡ Investor Mode: All trades use real funds. Proceed with caution.'
                    : '🎓 Learner Mode: Practice with $10,000 virtual balance. No real money involved.'}
                </Text>
              </div>
              
              {/* KYC Status Notice */}
              {settings?.kycStatus === 'PENDING' && (
                <div 
                  style={{ 
                    padding: `${token.paddingSM}px ${token.paddingMD}px`,
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: token.borderRadius,
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    marginTop: token.marginSM,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text 
                    style={{ 
                      fontSize: token.fontSizeSM, 
                      color: '#DC2626',
                      fontWeight: fontWeights.medium,
                    }}
                  >
                    ⚠️ Complete identity verification to unlock Investor mode
                  </Text>
                  <Button 
                    type="primary" 
                    size="small" 
                    danger
                    onClick={() => router.push('/onboarding')}
                  >
                    Verify Now
                  </Button>
                </div>
              )}
              
              {settings?.kycStatus === 'SUBMITTED' && (
                <div 
                  style={{ 
                    padding: `${token.paddingSM}px ${token.paddingMD}px`,
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: token.borderRadius,
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginTop: token.marginSM,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text 
                    style={{ 
                      fontSize: token.fontSizeSM, 
                      color: '#2563EB',
                      fontWeight: fontWeights.medium,
                    }}
                  >
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    Your identity verification is in progress. This usually takes a few minutes.
                  </Text>
                  <Button 
                    type="default" 
                    size="small"
                    onClick={() => router.push('/onboarding/status')}
                  >
                    Check Status
                  </Button>
                </div>
              )}
              
              {settings?.kycStatus === 'REJECTED' && (
                <div 
                  style={{ 
                    padding: `${token.paddingSM}px ${token.paddingMD}px`,
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: token.borderRadius,
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    marginTop: token.marginSM,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text 
                    style={{ 
                      fontSize: token.fontSizeSM, 
                      color: '#DC2626',
                      fontWeight: fontWeights.medium,
                    }}
                  >
                    <CloseCircleOutlined style={{ marginRight: 8 }} />
                    Verification unsuccessful. Please try again.
                  </Text>
                  <Button 
                    type="primary" 
                    size="small" 
                    danger
                    onClick={() => router.push('/onboarding/verify')}
                  >
                    Try Again
                  </Button>
                </div>
              )}

              <div style={{ display: 'flex', gap: token.marginXS, marginTop: token.marginMD }}>
                {settings?.emailVerified && (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    Email Verified
                  </Tag>
                )}
                {settings?.phoneVerified && (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    Phone Verified
                  </Tag>
                )}
              </div>
            </SectionCard>
          </motion.div>

          {/* Learner Mode Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <SectionCard
              title="Learner Mode"
              icon={<ExperimentOutlined />}
              gradient="linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)"
            >
              <div style={{ marginBottom: token.marginMD }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: token.marginMD }}>
                  Learner Mode gives you $10,000 in virtual funds to practice trading without any risk. 
                  All trades are simulated using real market prices.
                </Text>
                
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: token.marginSM,
                    marginBottom: token.marginMD,
                  }}
                >
                  <div
                    style={{
                      padding: token.paddingMD,
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderRadius: token.borderRadius,
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <Text style={{ fontSize: token.fontSizeSM, color: '#D97706', fontWeight: fontWeights.semibold }}>
                      ✓ Real Market Prices
                    </Text>
                  </div>
                  <div
                    style={{
                      padding: token.paddingMD,
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderRadius: token.borderRadius,
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <Text style={{ fontSize: token.fontSizeSM, color: '#D97706', fontWeight: fontWeights.semibold }}>
                      ✓ Simulated Trades
                    </Text>
                  </div>
                  <div
                    style={{
                      padding: token.paddingMD,
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderRadius: token.borderRadius,
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <Text style={{ fontSize: token.fontSizeSM, color: '#D97706', fontWeight: fontWeights.semibold }}>
                      ✓ No Real Money Risk
                    </Text>
                  </div>
                  <div
                    style={{
                      padding: token.paddingMD,
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderRadius: token.borderRadius,
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <Text style={{ fontSize: token.fontSizeSM, color: '#D97706', fontWeight: fontWeights.semibold }}>
                      ✓ Track Performance
                    </Text>
                  </div>
                </div>
              </div>
              
              <Divider style={{ margin: `${token.marginSM}px 0` }} />
              
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: `${token.paddingMD}px 0`,
                }}
              >
                <div>
                  <Text style={{ fontWeight: fontWeights.medium, display: 'block' }}>
                    Reset Learner Account
                  </Text>
                  <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                    Start fresh with $10,000 virtual balance. All trades and history will be cleared.
                  </Text>
                </div>
                <Popconfirm
                  title="Reset Learner Account"
                  description="This will clear all your learner trades and reset your balance to $10,000. Are you sure?"
                  onConfirm={handleResetLearnerAccount}
                  okText="Yes, Reset"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true, loading: resetLoading }}
                >
                  <Button 
                    danger 
                    loading={resetLoading}
                    disabled={appMode !== 'learner'}
                  >
                    Reset Account
                  </Button>
                </Popconfirm>
              </div>
              
              {appMode !== 'learner' && (
                <Text type="secondary" style={{ fontSize: token.fontSizeSM, fontStyle: 'italic' }}>
                  Switch to Learner Mode to enable account reset.
                </Text>
              )}
            </SectionCard>
          </motion.div>

          {/* KYC Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <SectionCard
              title="Identity Verification"
              icon={<SafetyCertificateOutlined />}
              gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
              extra={<KycStatusBadge status={settings?.kycStatus || 'PENDING'} />}
            >
              {settings?.kyc ? (
                <>
                  <InfoRow
                    icon={<UserOutlined />}
                    label="Full Name"
                    value={
                      [settings.kyc.firstName, settings.kyc.middleName, settings.kyc.lastName]
                        .filter(Boolean)
                        .join(' ') || '—'
                    }
                  />
                  <InfoRow
                    icon={<CalendarOutlined />}
                    label="Date of Birth"
                    value={formatDate(settings.kyc.dateOfBirth)}
                  />
                  <InfoRow
                    icon={<HomeOutlined />}
                    label="Address"
                    value={
                      settings.kyc.street1
                        ? `${settings.kyc.street1}${settings.kyc.street2 ? `, ${settings.kyc.street2}` : ''}`
                        : '—'
                    }
                  />
                  <InfoRow
                    icon={<GlobalOutlined />}
                    label="City / State"
                    value={
                      settings.kyc.city
                        ? `${settings.kyc.city}, ${getStateName(settings.kyc.country, settings.kyc.region)}`
                        : '—'
                    }
                  />
                  <InfoRow
                    icon={<GlobalOutlined />}
                    label="Country"
                    value={getCountryName(settings.kyc.country)}
                  />
                  {settings.kyc.veriffReason && settings.kycStatus === 'REJECTED' && (
                    <div
                      style={{
                        marginTop: token.marginMD,
                        padding: token.paddingSM,
                        backgroundColor: token.colorErrorBg,
                        borderRadius: token.borderRadius,
                      }}
                    >
                      <Text type="danger" style={{ fontSize: token.fontSizeSM }}>
                        <CloseCircleOutlined /> {settings.kyc.veriffReason}
                      </Text>
                    </div>
                  )}
                </>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No KYC information available"
                >
                  <Button type="primary" onClick={() => router.push('/onboarding')}>
                    Complete Verification
                  </Button>
                </Empty>
              )}
              <Text
                type="secondary"
                style={{
                  display: 'block',
                  marginTop: token.marginMD,
                  fontSize: token.fontSizeSM,
                  fontStyle: 'italic',
                }}
              >
                KYC details cannot be changed after verification. Contact support for assistance.
              </Text>
            </SectionCard>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <SectionCard
              title="Security"
              icon={<LockOutlined />}
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: `${token.paddingMD}px 0`,
                }}
              >
                <div>
                  <Text style={{ fontWeight: fontWeights.medium, display: 'block' }}>Password</Text>
                  <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                    Change your account password
                  </Text>
                </div>
                <Button type="primary" onClick={() => setPasswordModalVisible(true)}>
                  Change Password
                </Button>
              </div>
              <Divider style={{ margin: `${token.marginSM}px 0` }} />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: `${token.paddingMD}px 0`,
                }}
              >
                <div>
                  <Text style={{ fontWeight: fontWeights.medium, display: 'block' }}>
                    Two-Factor Authentication
                  </Text>
                  <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                    Add an extra layer of security
                  </Text>
                </div>
                <Tag color="success">Enabled (Phone)</Tag>
              </div>
            </SectionCard>
          </motion.div>

          {/* Bank Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <SectionCard
              title="Bank Accounts"
              icon={<BankOutlined />}
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => router.push('/portfolio/bank-accounts/add')}
                >
                  Add
                </Button>
              }
            >
              {bankAccountsLoading ? (
                <Skeleton active paragraph={{ rows: 2 }} />
              ) : bankAccounts.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No bank accounts added"
                >
                  <Button type="primary" onClick={() => router.push('/portfolio/bank-accounts/add')}>
                    Add Bank Account
                  </Button>
                </Empty>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: token.marginSM }}>
                  {bankAccounts.map((account) => (
                    <div
                      key={account.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: token.paddingSM,
                        backgroundColor: token.colorBgLayout,
                        borderRadius: token.borderRadius,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: token.marginXS,
                            marginBottom: token.marginXXS,
                          }}
                        >
                          <Text strong>{account.accountName}</Text>
                          {account.isVerified && (
                            <CheckCircleOutlined style={{ color: token.colorSuccess }} />
                          )}
                        </div>
                        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                          •••• {account.last4} • {account.accountType}
                        </Text>
                      </div>
                      <Popconfirm
                        title="Delete bank account"
                        description="Are you sure you want to delete this bank account?"
                        onConfirm={() => handleDeleteBankAccount(account.id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                      >
                        <Button danger type="text" icon={<DeleteOutlined />} size="small" />
                      </Popconfirm>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: token.marginMD }}>
                <Link href="/portfolio/bank-accounts">
                  <Button type="link" style={{ paddingLeft: 0 }}>
                    Manage all bank accounts →
                  </Button>
                </Link>
              </div>
            </SectionCard>
          </motion.div>

          {/* Notification Preferences - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}
          >
            <SectionCard
              title="Notification Preferences"
              icon={<BellOutlined />}
              gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            >
              <Collapse
                ghost
                defaultActiveKey={['email']}
                items={[
                  {
                    key: 'email',
                    label: (
                      <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
                        <MailOutlined />
                        <Text strong>Email Notifications</Text>
                      </div>
                    ),
                    children: (
                      <>
                        <NotificationToggle
                          label="Marketing & Promotions"
                          description="Receive promotional offers and updates"
                          checked={notificationPrefs.emailMarketing}
                          onChange={(val) => handleNotificationChange('emailMarketing', val)}
                        />
                        <NotificationToggle
                          label="Security Alerts"
                          description="Login alerts and suspicious activity"
                          checked={notificationPrefs.emailSecurityAlerts}
                          onChange={(val) => handleNotificationChange('emailSecurityAlerts', val)}
                        />
                        <NotificationToggle
                          label="Transaction Updates"
                          description="Deposit, withdrawal, and trade confirmations"
                          checked={notificationPrefs.emailTransactions}
                          onChange={(val) => handleNotificationChange('emailTransactions', val)}
                        />
                        <NotificationToggle
                          label="Price Alerts"
                          description="Price movement notifications for watchlist"
                          checked={notificationPrefs.emailPriceAlerts}
                          onChange={(val) => handleNotificationChange('emailPriceAlerts', val)}
                        />
                        <NotificationToggle
                          label="News & Updates"
                          description="Platform news and feature updates"
                          checked={notificationPrefs.emailNewsUpdates}
                          onChange={(val) => handleNotificationChange('emailNewsUpdates', val)}
                        />
                      </>
                    ),
                  },
                  {
                    key: 'push',
                    label: (
                      <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
                        <MobileOutlined />
                        <Text strong>Push Notifications</Text>
                      </div>
                    ),
                    children: (
                      <>
                        <NotificationToggle
                          label="Enable Push Notifications"
                          description="Master toggle for all push notifications"
                          checked={notificationPrefs.pushEnabled}
                          onChange={(val) => handleNotificationChange('pushEnabled', val)}
                        />
                        <NotificationToggle
                          label="Security Alerts"
                          description="Login and suspicious activity alerts"
                          checked={notificationPrefs.pushSecurityAlerts}
                          onChange={(val) => handleNotificationChange('pushSecurityAlerts', val)}
                          disabled={!notificationPrefs.pushEnabled}
                        />
                        <NotificationToggle
                          label="Transaction Updates"
                          description="Trade and payment confirmations"
                          checked={notificationPrefs.pushTransactions}
                          onChange={(val) => handleNotificationChange('pushTransactions', val)}
                          disabled={!notificationPrefs.pushEnabled}
                        />
                        <NotificationToggle
                          label="Price Alerts"
                          description="Price movement notifications"
                          checked={notificationPrefs.pushPriceAlerts}
                          onChange={(val) => handleNotificationChange('pushPriceAlerts', val)}
                          disabled={!notificationPrefs.pushEnabled}
                        />
                        <NotificationToggle
                          label="News & Updates"
                          description="Platform announcements"
                          checked={notificationPrefs.pushNewsUpdates}
                          onChange={(val) => handleNotificationChange('pushNewsUpdates', val)}
                          disabled={!notificationPrefs.pushEnabled}
                        />
                      </>
                    ),
                  },
                  {
                    key: 'sms',
                    label: (
                      <div style={{ display: 'flex', alignItems: 'center', gap: token.marginSM }}>
                        <SoundOutlined />
                        <Text strong>SMS Notifications</Text>
                      </div>
                    ),
                    children: (
                      <>
                        <NotificationToggle
                          label="Enable SMS Notifications"
                          description="Master toggle for all SMS notifications"
                          checked={notificationPrefs.smsEnabled}
                          onChange={(val) => handleNotificationChange('smsEnabled', val)}
                        />
                        <NotificationToggle
                          label="Security Alerts"
                          description="2FA codes and login from new devices"
                          checked={notificationPrefs.smsSecurityAlerts}
                          onChange={(val) => handleNotificationChange('smsSecurityAlerts', val)}
                          disabled={!notificationPrefs.smsEnabled}
                        />
                        <NotificationToggle
                          label="Large Transaction Alerts"
                          description="Alerts for transactions above threshold"
                          checked={notificationPrefs.smsTransactions}
                          onChange={(val) => handleNotificationChange('smsTransactions', val)}
                          disabled={!notificationPrefs.smsEnabled}
                        />
                      </>
                    ),
                  },
                ]}
              />
            </SectionCard>
          </motion.div>
        </div>

        {/* Password Change Modal */}
        <Modal
          open={passwordModalVisible}
          onCancel={() => {
            setPasswordModalVisible(false);
            resetPasswordModal();
          }}
          footer={null}
          title={
            <Space>
              <LockOutlined />
              <span>Change Password</span>
            </Space>
          }
          width={480}
        >
          {passwordStep === 'request' ? (
            <div style={{ textAlign: 'center', padding: token.paddingLG }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  marginBottom: token.marginLG,
                }}
              >
                <LockOutlined style={{ fontSize: 32, color: '#fff' }} />
              </div>
              <Title level={4}>Verify Your Identity</Title>
              <Paragraph type="secondary">
                We'll send a verification code to your email address ({settings?.email}) to confirm
                it's you.
              </Paragraph>
              <Button
                type="primary"
                size="large"
                loading={passwordLoading}
                onClick={handleRequestPasswordChange}
                block
              >
                Send Verification Code
              </Button>
            </div>
          ) : (
            <div style={{ padding: token.paddingSM }}>
              {/* OTP Input */}
              <div style={{ marginBottom: token.marginLG }}>
                <Text style={{ fontWeight: fontWeights.medium, marginBottom: token.marginSM, display: 'block' }}>
                  Verification Code
                </Text>
                <OTPInput value={otp} onChange={setOtp} disabled={passwordLoading} />
                <Text
                  style={{
                    fontSize: token.fontSizeSM,
                    color: resendCooldown > 0 ? token.colorTextDisabled : token.colorPrimary,
                    cursor: resendCooldown > 0 ? 'default' : 'pointer',
                    marginTop: token.marginSM,
                    textAlign: 'center',
                    display: 'block',
                  }}
                  onClick={resendCooldown > 0 ? undefined : handleRequestPasswordChange}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </Text>
              </div>

              {/* New Password */}
              <div style={{ marginBottom: token.marginMD }}>
                <Text style={{ fontWeight: fontWeights.medium, marginBottom: token.marginXS, display: 'block' }}>
                  New Password
                </Text>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  size="large"
                  prefix={<LockOutlined style={{ color: token.colorTextSecondary }} />}
                  suffix={
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer', color: token.colorTextSecondary }}
                    >
                      {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </span>
                  }
                />
                <Text type="secondary" style={{ fontSize: token.fontSizeSM, marginTop: token.marginXXS, display: 'block' }}>
                  Min 8 chars, uppercase, lowercase, number, special char
                </Text>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: token.marginLG }}>
                <Text style={{ fontWeight: fontWeights.medium, marginBottom: token.marginXS, display: 'block' }}>
                  Confirm Password
                </Text>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  size="large"
                  prefix={<LockOutlined style={{ color: token.colorTextSecondary }} />}
                />
              </div>

              <Button
                type="primary"
                size="large"
                loading={passwordLoading}
                onClick={handleChangePassword}
                block
                disabled={otp.length !== 6 || !newPassword || !confirmPassword}
              >
                Change Password
              </Button>
            </div>
          )}
        </Modal>
    </>
  );
};

// Persistent layout - keeps DashboardLayout mounted across page navigations
SettingsPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default SettingsPage;

