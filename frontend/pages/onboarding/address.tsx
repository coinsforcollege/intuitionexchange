import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Form, Input, Select, message, theme, Skeleton, Row, Col } from 'antd';
import { HomeOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Country, State, ICountry, IState } from 'country-state-city';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import LoadingButton from '@/components/auth/LoadingButton';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { getKycDetails, saveAddress, AddressData, ApiError } from '@/services/api/onboarding';

const { useToken } = theme;

export default function AddressPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);
  // Default to user's country from registration, fallback to US
  const [selectedCountry, setSelectedCountry] = useState<string>(user?.country || 'US');

  // Get all countries from library
  const countryOptions = useMemo(() => {
    const countries = Country.getAllCountries();
    return countries.map((country: ICountry) => ({
      value: country.isoCode,
      label: `${country.flag} ${country.name}`,
      searchValue: `${country.name} ${country.isoCode}`,
    }));
  }, []);

  // Get states/provinces for selected country
  const stateOptions = useMemo(() => {
    const states = State.getStatesOfCountry(selectedCountry);
    return states.map((state: IState) => ({
      value: state.isoCode,
      label: state.name,
      searchValue: `${state.name} ${state.isoCode}`,
    }));
  }, [selectedCountry]);

  // Check if selected country has states
  const hasStates = stateOptions.length > 0;

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
        if (details?.address) {
          const { street1, street2, city, region, postalCode, country } = details.address;
          // Use KYC country if exists, otherwise use user's registration country
          const countryValue = country || user?.country || 'US';
          form.setFieldsValue({
            street1: street1 || '',
            street2: street2 || '',
            city: city || '',
            region: region || '',
            postalCode: postalCode || '',
            country: countryValue,
          });
          setSelectedCountry(countryValue);
        } else {
          // No KYC data yet - pre-populate with user's registration country
          const userCountry = user?.country || 'US';
          form.setFieldsValue({ country: userCountry });
          setSelectedCountry(userCountry);
        }
      } catch {
        // Continue with form using user's country from registration
        const userCountry = user?.country || 'US';
        form.setFieldsValue({ country: userCountry });
        setSelectedCountry(userCountry);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [user, router, form]);

  const handleSubmit = async (values: AddressData) => {
    setLoading(true);
    try {
      await saveAddress({
        street1: values.street1,
        street2: values.street2 || undefined,
        city: values.city,
        region: values.region,
        postalCode: values.postalCode,
        country: values.country,
      });

      message.success('Address saved');
      router.push('/onboarding/verify');
    } catch (error) {
      const apiError = error as ApiError;
      message.error(apiError.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    form.setFieldValue('region', ''); // Reset region when country changes
  };

  const filterOption = (input: string, option: { label?: string; value?: string; searchValue?: string } | undefined) => {
    const searchValue = option?.searchValue || option?.label || '';
    return searchValue.toLowerCase().startsWith(input.toLowerCase());
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

  const backButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginXS,
    color: token.colorTextSecondary,
    fontSize: token.fontSize,
    cursor: 'pointer',
    marginBottom: token.marginLG,
  };

  // Dynamic label based on country
  const getRegionLabel = () => {
    if (selectedCountry === 'US') return 'State';
    if (selectedCountry === 'CA') return 'Province';
    if (selectedCountry === 'GB') return 'County';
    if (selectedCountry === 'AU') return 'State/Territory';
    if (selectedCountry === 'IN') return 'State';
    return 'State/Province/Region';
  };

  const getPostalCodeLabel = () => {
    if (selectedCountry === 'US') return 'ZIP Code';
    if (selectedCountry === 'GB') return 'Postcode';
    if (selectedCountry === 'CA') return 'Postal Code';
    return 'Postal Code';
  };

  if (pageLoading) {
    return (
      <>
        <Head>
          <title>Address - InTuition Exchange</title>
        </Head>
        <OnboardingLayout currentStep={1} title="Your Address" subtitle="Where do you currently reside?">
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        </OnboardingLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Address - InTuition Exchange</title>
        <meta name="description" content="Enter your address for verification" />
      </Head>

      <OnboardingLayout
        currentStep={1}
        title="Your Address"
        subtitle="Enter your current residential address"
      >
        <div style={formContainerStyle}>
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            {/* Back Button */}
            <div style={backButtonStyle} onClick={() => router.push('/onboarding/personal')}>
              <ArrowLeftOutlined />
              Back to Personal Details
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              size="large"
              initialValues={{ country: user?.country || 'US' }}
            >
              {/* Country */}
              <Form.Item
                name="country"
                label={<span style={labelStyle}>Country</span>}
                rules={[{ required: true, message: 'Please select your country' }]}
                style={{ marginBottom: token.marginMD }}
              >
                <Select
                  showSearch
                  placeholder="Select country"
                  options={countryOptions}
                  disabled={loading}
                  onChange={handleCountryChange}
                  optionFilterProp="searchValue"
                  filterOption={filterOption}
                  style={inputStyle}
                />
              </Form.Item>

              {/* Street Address */}
              <Form.Item
                name="street1"
                label={<span style={labelStyle}>Street Address</span>}
                rules={[
                  { required: true, message: 'Please enter your street address' },
                  { max: 200, message: 'Address is too long' },
                ]}
                style={{ marginBottom: token.marginMD }}
              >
                <Input
                  prefix={<HomeOutlined style={{ color: token.colorTextSecondary }} />}
                  placeholder="123 Main Street"
                  style={inputStyle}
                  disabled={loading}
                />
              </Form.Item>

              {/* Street Address 2 (Optional) */}
              <Form.Item
                name="street2"
                label={<span style={labelStyle}>Apartment, Suite, etc. (Optional)</span>}
                rules={[{ max: 200, message: 'Address is too long' }]}
                style={{ marginBottom: token.marginMD }}
              >
                <Input
                  placeholder="Apt 4B"
                  style={inputStyle}
                  disabled={loading}
                />
              </Form.Item>

              {/* City & Region Row */}
              <Row gutter={token.marginMD}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="city"
                    label={<span style={labelStyle}>City</span>}
                    rules={[
                      { required: true, message: 'Please enter your city' },
                      { max: 100, message: 'City name is too long' },
                    ]}
                    style={{ marginBottom: token.marginMD }}
                  >
                    <Input
                      placeholder="City"
                      style={inputStyle}
                      disabled={loading}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="region"
                    label={<span style={labelStyle}>{getRegionLabel()}</span>}
                    rules={[
                      { required: true, message: `Please ${hasStates ? 'select' : 'enter'} your ${getRegionLabel().toLowerCase()}` },
                      { max: 100, message: `${getRegionLabel()} is too long` },
                    ]}
                    style={{ marginBottom: token.marginMD }}
                  >
                    {hasStates ? (
                      <Select
                        showSearch
                        placeholder={`Select ${getRegionLabel().toLowerCase()}`}
                        options={stateOptions}
                        disabled={loading}
                        filterOption={filterOption}
                        style={inputStyle}
                      />
                    ) : (
                      <Input
                        placeholder={getRegionLabel()}
                        style={inputStyle}
                        disabled={loading}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              {/* Postal Code */}
              <Form.Item
                name="postalCode"
                label={<span style={labelStyle}>{getPostalCodeLabel()}</span>}
                rules={[
                  { required: true, message: `Please enter your ${getPostalCodeLabel().toLowerCase()}` },
                  { max: 20, message: `${getPostalCodeLabel()} is too long` },
                ]}
                style={{ marginBottom: token.marginXL }}
              >
                <Input
                  placeholder={getPostalCodeLabel()}
                  style={{ ...inputStyle, maxWidth: 150 }}
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
        </div>
      </OnboardingLayout>
    </>
  );
}
