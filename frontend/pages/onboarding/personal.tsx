import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Form, Input, DatePicker, Button, message, theme, Grid, Skeleton } from 'antd';
import { UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import LoadingButton from '@/components/auth/LoadingButton';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { getKycDetails, savePersonalDetails, PersonalDetailsData, ApiError } from '@/services/api/onboarding';

const { useToken } = theme;
const { useBreakpoint } = Grid;

export default function PersonalDetailsPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
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

  const inputStyle: React.CSSProperties = {
    height: token.controlHeightLG,
    fontSize: token.fontSize,
    borderRadius: token.borderRadius,
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: fontWeights.medium,
    fontSize: token.fontSize,
  };

  const formContainerStyle: React.CSSProperties = {
    opacity: isAnimated ? 1 : 0,
    transform: `translateY(${isAnimated ? 0 : 20}px)`,
    transition: 'all 0.5s ease-out',
  };

  if (pageLoading) {
    return (
      <>
        <Head>
          <title>Personal Details - InTuition Exchange</title>
        </Head>
        <OnboardingLayout currentStep={0} title="Personal Details" subtitle="Tell us about yourself">
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
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
        <div style={formContainerStyle}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            size="large"
            style={{ maxWidth: 400, margin: '0 auto' }}
          >
            {/* First Name */}
            <Form.Item
              name="firstName"
              label={<span style={labelStyle}>First Name</span>}
              rules={[
                { required: true, message: 'Please enter your first name' },
                { max: 100, message: 'First name is too long' },
              ]}
              style={{ marginBottom: token.marginMD }}
            >
              <Input
                prefix={<UserOutlined style={{ color: token.colorTextSecondary }} />}
                placeholder="John"
                style={inputStyle}
                disabled={loading}
              />
            </Form.Item>

            {/* Middle Name (Optional) */}
            <Form.Item
              name="middleName"
              label={<span style={labelStyle}>Middle Name (Optional)</span>}
              rules={[{ max: 100, message: 'Middle name is too long' }]}
              style={{ marginBottom: token.marginMD }}
            >
              <Input
                placeholder="William"
                style={inputStyle}
                disabled={loading}
              />
            </Form.Item>

            {/* Last Name */}
            <Form.Item
              name="lastName"
              label={<span style={labelStyle}>Last Name</span>}
              rules={[
                { required: true, message: 'Please enter your last name' },
                { max: 100, message: 'Last name is too long' },
              ]}
              style={{ marginBottom: token.marginMD }}
            >
              <Input
                placeholder="Doe"
                style={inputStyle}
                disabled={loading}
              />
            </Form.Item>

            {/* Date of Birth */}
            <Form.Item
              name="dateOfBirth"
              label={<span style={labelStyle}>Date of Birth</span>}
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
                style={{ ...inputStyle, width: '100%' }}
                format="MMMM D, YYYY"
                disabledDate={(current) => current && current > dayjs().subtract(18, 'year')}
                disabled={loading}
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item style={{ marginBottom: 0 }}>
              <LoadingButton loading={loading} htmlType="submit">
                Continue <ArrowRightOutlined />
              </LoadingButton>
            </Form.Item>
          </Form>
        </div>
      </OnboardingLayout>
    </>
  );
}

