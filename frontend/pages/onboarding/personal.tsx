import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Form, Input, Select, Button, message, theme, Grid, Skeleton } from 'antd';
import { UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';
import { getKycDetails, savePersonalDetails, PersonalDetailsData, ApiError } from '@/services/api/onboarding';

const { useToken } = theme;
const { useBreakpoint } = Grid;

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

// Date of Birth options
const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: String(i + 1),
}));

// Years from current year - 18 to current year - 100 (must be 18+)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 82 }, (_, i) => ({
  value: String(currentYear - 18 - i),
  label: String(currentYear - 18 - i),
}));

export default function PersonalDetailsPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user } = useAuth();
  const { mode } = useThemeMode();
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isDark = mode === 'dark';
  const isMobile = !screens.md;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  // Date of birth state for controlled native selects
  const [birthMonth, setBirthMonth] = useState<string>('');
  const [birthDay, setBirthDay] = useState<string>('');
  const [birthYear, setBirthYear] = useState<string>('');

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/onboarding');
      return;
    }

    // Load existing data
    const loadData = async () => {
      try {
        const details = await getKycDetails();
        if (details?.personalDetails) {
          const { firstName, middleName, lastName, dateOfBirth } = details.personalDetails;
          
          // Parse existing date of birth if present (format: YYYY-MM-DD)
          let month = '', day = '', year = '';
          if (dateOfBirth) {
            const parts = dateOfBirth.split('-');
            if (parts.length === 3) {
              year = parts[0];
              month = parts[1];
              day = parts[2];
            }
          }
          
          form.setFieldsValue({
            firstName: firstName || '',
            middleName: middleName || '',
            lastName: lastName || '',
            birthMonth: month,
            birthDay: day,
            birthYear: year,
          });
          
          // Update state for native selects
          setBirthMonth(month);
          setBirthDay(day);
          setBirthYear(year);
        }
      } catch {
        // Continue with empty form
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [user, router, form]);

  const handleSubmit = async (values: PersonalDetailsData & { birthMonth: string; birthDay: string; birthYear: string }) => {
    setLoading(true);
    try {
      // Construct date in YYYY-MM-DD format
      const dateOfBirth = `${values.birthYear}-${values.birthMonth}-${values.birthDay}`;
      
      await savePersonalDetails({
        firstName: values.firstName,
        middleName: values.middleName || undefined,
        lastName: values.lastName,
        dateOfBirth,
      });

      message.success('Personal details saved');
      router.push('/onboarding/address');
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Themed input styles
  const getInputStyle = (): React.CSSProperties => ({
    background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)',
    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.5)',
    borderRadius: 12,
    height: 48,
    fontSize: token.fontSize,
    color: isDark ? '#ffffff' : '#1a1a2e',
  });

  const getLabelStyle = (): React.CSSProperties => ({
    fontWeight: fontWeights.medium,
    fontSize: token.fontSize,
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  });

  const getButtonStyle = (primary = true): React.CSSProperties => ({
    background: primary
      ? (isDark
          ? `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.dark} 100%)`
          : `linear-gradient(135deg, ${warmColors.coral} 0%, #C45C44 100%)`)
      : (isDark
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.15)'),
    boxShadow: primary
      ? (isDark ? `0 4px 14px rgba(99, 102, 241, 0.4)` : `0 4px 14px rgba(224,122,95,0.4)`)
      : 'none',
    border: primary ? 'none' : '1px solid rgba(255,255,255,0.3)',
    borderRadius: 12,
    color: '#ffffff',
    fontWeight: fontWeights.bold,
    height: 48,
    fontSize: token.fontSize,
  });

  // Form error styles for visibility
  const formStyles = isDark 
    ? `
      .onboarding-form .ant-form-item-explain-error {
        color: #FCA5A5 !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        font-weight: 500;
      }
      .onboarding-form .ant-form-item-has-error .ant-input,
      .onboarding-form .ant-form-item-has-error .ant-picker {
        border-color: #FCA5A5 !important;
      }
      .onboarding-form .ant-input::placeholder,
      .onboarding-form .ant-picker-input input::placeholder {
        color: rgba(255,255,255,0.4) !important;
      }
      .onboarding-form .ant-input-prefix {
        color: rgba(255,255,255,0.5) !important;
      }
    `
    : `
      .onboarding-form .ant-form-item-explain-error {
        color: #FFE066 !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        font-weight: 500;
      }
      .onboarding-form .ant-form-item-has-error .ant-input,
      .onboarding-form .ant-form-item-has-error .ant-picker {
        border-color: #FFE066 !important;
      }
      .onboarding-form .ant-input::placeholder,
      .onboarding-form .ant-picker-input input::placeholder {
        color: rgba(0,0,0,0.35) !important;
      }
    `;

  if (pageLoading) {
    return (
      <>
        <Head>
          <title>Personal Details - InTuition Exchange</title>
        </Head>
        <OnboardingLayout currentStep={0} title="Personal Details" subtitle="Tell us about yourself">
          <Skeleton active paragraph={{ rows: 6 }} />
        </OnboardingLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Personal Details - InTuition Exchange</title>
        <meta name="description" content="Enter your personal details for verification" />
      </Head>

      <OnboardingLayout
        currentStep={0}
        title="Personal Details"
        subtitle="Enter your legal name as it appears on your ID"
      >
        <style>{formStyles}</style>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            size="large"
            className="onboarding-form"
          >
            {/* First Name */}
            <Form.Item
              name="firstName"
              label={<span style={getLabelStyle()}>First Name</span>}
              rules={[
                { required: true, message: 'Please enter your first name' },
                { max: 100, message: 'First name is too long' },
              ]}
              style={{ marginBottom: token.marginMD }}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="John"
                style={getInputStyle()}
                disabled={loading}
              />
            </Form.Item>

            {/* Middle Name (Optional) */}
            <Form.Item
              name="middleName"
              label={<span style={getLabelStyle()}>Middle Name <span style={{ fontWeight: 400, opacity: 0.7 }}>(Optional)</span></span>}
              rules={[{ max: 100, message: 'Middle name is too long' }]}
              style={{ marginBottom: token.marginMD }}
            >
              <Input
                placeholder="William"
                style={getInputStyle()}
                disabled={loading}
              />
            </Form.Item>

            {/* Last Name */}
            <Form.Item
              name="lastName"
              label={<span style={getLabelStyle()}>Last Name</span>}
              rules={[
                { required: true, message: 'Please enter your last name' },
                { max: 100, message: 'Last name is too long' },
              ]}
              style={{ marginBottom: token.marginMD }}
            >
              <Input
                placeholder="Doe"
                style={getInputStyle()}
                disabled={loading}
              />
            </Form.Item>

            {/* Date of Birth - 3 separate dropdowns */}
            <div style={{ marginBottom: token.marginXL }}>
              <span style={{ ...getLabelStyle(), display: 'block', marginBottom: 8 }}>
                Date of Birth
              </span>
              <div style={{ display: 'flex', gap: token.marginSM }}>
                {/* Month */}
                <Form.Item
                  name="birthMonth"
                  rules={[{ required: true, message: 'Month', validator: (_, value) => value ? Promise.resolve() : Promise.reject('Month') }]}
                  style={{ flex: 1.5, marginBottom: 0 }}
                >
                  {isMobile ? (
                    <select
                      style={{
                        ...getInputStyle(),
                        width: '100%',
                        padding: '0 12px',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.5 : 1,
                        color: birthMonth ? (isDark ? '#ffffff' : '#1a1a2e') : 'rgba(255,255,255,0.4)',
                      }}
                      value={birthMonth}
                      disabled={loading}
                      onChange={(e) => {
                        form.setFieldsValue({ birthMonth: e.target.value });
                        setBirthMonth(e.target.value);
                      }}
                    >
                      <option value="">Month</option>
                      {MONTHS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  ) : (
                    <Select
                      placeholder="Month"
                      options={MONTHS}
                      style={getInputStyle()}
                      disabled={loading}
                    />
                  )}
                </Form.Item>

                {/* Day */}
                <Form.Item
                  name="birthDay"
                  rules={[{ required: true, message: 'Day', validator: (_, value) => value ? Promise.resolve() : Promise.reject('Day') }]}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  {isMobile ? (
                    <select
                      style={{
                        ...getInputStyle(),
                        width: '100%',
                        padding: '0 12px',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.5 : 1,
                        color: birthDay ? (isDark ? '#ffffff' : '#1a1a2e') : 'rgba(255,255,255,0.4)',
                      }}
                      value={birthDay}
                      disabled={loading}
                      onChange={(e) => {
                        form.setFieldsValue({ birthDay: e.target.value });
                        setBirthDay(e.target.value);
                      }}
                    >
                      <option value="">Day</option>
                      {DAYS.map(d => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  ) : (
                    <Select
                      placeholder="Day"
                      options={DAYS}
                      style={getInputStyle()}
                      disabled={loading}
                    />
                  )}
                </Form.Item>

                {/* Year */}
                <Form.Item
                  name="birthYear"
                  rules={[{ required: true, message: 'Year', validator: (_, value) => value ? Promise.resolve() : Promise.reject('Year') }]}
                  style={{ flex: 1.2, marginBottom: 0 }}
                >
                  {isMobile ? (
                    <select
                      style={{
                        ...getInputStyle(),
                        width: '100%',
                        padding: '0 12px',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.5 : 1,
                        color: birthYear ? (isDark ? '#ffffff' : '#1a1a2e') : 'rgba(255,255,255,0.4)',
                      }}
                      value={birthYear}
                      disabled={loading}
                      onChange={(e) => {
                        form.setFieldsValue({ birthYear: e.target.value });
                        setBirthYear(e.target.value);
                      }}
                    >
                      <option value="">Year</option>
                      {YEARS.map(y => (
                        <option key={y.value} value={y.value}>{y.label}</option>
                      ))}
                    </select>
                  ) : (
                    <Select
                      placeholder="Year"
                      options={YEARS}
                      style={getInputStyle()}
                      disabled={loading}
                      showSearch
                      optionFilterProp="label"
                    />
                  )}
                </Form.Item>
              </div>
              <div style={{ 
                fontSize: token.fontSizeSM, 
                color: 'rgba(255,255,255,0.6)', 
                marginTop: token.marginXS,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}>
                You must be at least 18 years old
              </div>
            </div>

            {/* Submit Button */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={getButtonStyle()}
              >
                Continue <ArrowRightOutlined />
              </Button>
            </Form.Item>
          </Form>
        </motion.div>
      </OnboardingLayout>
    </>
  );
}
