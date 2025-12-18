import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Form, Input, DatePicker, Button, message, theme, Grid, Skeleton } from 'antd';
import { UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import dayjs from 'dayjs';
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
          form.setFieldsValue({
            firstName: firstName || '',
            middleName: middleName || '',
            lastName: lastName || '',
            dateOfBirth: dateOfBirth ? dayjs(dateOfBirth) : null,
          });
        }
      } catch {
        // Continue with empty form
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [user, router, form]);

  const handleSubmit = async (values: PersonalDetailsData & { dateOfBirth: dayjs.Dayjs }) => {
    setLoading(true);
    try {
      await savePersonalDetails({
        firstName: values.firstName,
        middleName: values.middleName || undefined,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
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
          : 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)')
      : (isDark
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.2)'),
    boxShadow: primary
      ? (isDark ? `0 4px 14px rgba(99, 102, 241, 0.4)` : `0 4px 14px rgba(0,0,0,0.2)`)
      : 'none',
    border: primary ? 'none' : '1px solid rgba(255,255,255,0.3)',
    borderRadius: 12,
    color: primary ? (isDark ? '#ffffff' : themeColors.dark) : '#ffffff',
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

            {/* Date of Birth */}
            <Form.Item
              name="dateOfBirth"
              label={<span style={getLabelStyle()}>Date of Birth</span>}
              rules={[
                { required: true, message: 'Please select your date of birth' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const age = dayjs().diff(value, 'year');
                    if (age < 18) {
                      return Promise.reject(new Error('You must be at least 18 years old'));
                    }
                    if (age > 120) {
                      return Promise.reject(new Error('Please enter a valid date of birth'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              style={{ marginBottom: token.marginXL }}
            >
              <DatePicker
                placeholder="Select date"
                style={{ ...getInputStyle(), width: '100%' }}
                format="MMMM D, YYYY"
                disabledDate={(current) => current && current > dayjs().subtract(18, 'year')}
                disabled={loading}
              />
            </Form.Item>

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
