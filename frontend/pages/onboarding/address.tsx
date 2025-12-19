import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Form, Input, Select, message, theme, Skeleton, Row, Col, Button } from 'antd';
import { HomeOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Country, State, ICountry, IState } from 'country-state-city';
import { motion } from 'motion/react';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';
import { getKycDetails, saveAddress, AddressData, ApiError } from '@/services/api/onboarding';

const { useToken } = theme;
const { useBreakpoint } = Grid;
import { Grid } from 'antd';

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

export default function AddressPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user } = useAuth();
  const { mode } = useThemeMode();
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const isDark = mode === 'dark';
  const isMobile = !screens.md;
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>(user?.country || '');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  // Get all countries
  const countryOptions = useMemo(() => {
    const countries = Country.getAllCountries();
    return countries.map((country: ICountry) => ({
      value: country.isoCode,
      label: `${country.flag} ${country.name}`,
      searchValue: `${country.name} ${country.isoCode}`,
    }));
  }, []);

  // Get states for selected country
  const stateOptions = useMemo(() => {
    const states = State.getStatesOfCountry(selectedCountry);
    return states.map((state: IState) => ({
      value: state.isoCode,
      label: state.name,
      searchValue: `${state.name} ${state.isoCode}`,
    }));
  }, [selectedCountry]);

  const hasStates = stateOptions.length > 0;

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/onboarding');
      return;
    }

    const loadData = async () => {
      try {
        const details = await getKycDetails();
        if (details?.address) {
          const { street1, street2, city, region, postalCode, country } = details.address;
          const countryValue = country || user?.country || '';
          form.setFieldsValue({
            street1: street1 || '',
            street2: street2 || '',
            city: city || '',
            region: region || undefined,
            postalCode: postalCode || '',
            country: countryValue,
          });
          setSelectedCountry(countryValue);
          setSelectedRegion(region || '');
        } else {
          const userCountry = user?.country || '';
          form.setFieldsValue({ country: userCountry });
          setSelectedCountry(userCountry);
        }
      } catch {
        const userCountry = user?.country || '';
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
    setSelectedRegion('');
    form.setFieldValue('region', undefined);
  };

  const filterOption = (input: string, option: { label?: string; value?: string; searchValue?: string } | undefined) => {
    const searchValue = option?.searchValue || option?.label || '';
    return searchValue.toLowerCase().startsWith(input.toLowerCase());
  };

  // Dynamic labels
  const getRegionLabel = () => {
    if (selectedCountry === 'US') return 'State';
    if (selectedCountry === 'CA') return 'Province';
    if (selectedCountry === 'GB') return 'County';
    if (selectedCountry === 'AU') return 'State/Territory';
    if (selectedCountry === 'IN') return 'State';
    return 'Region';
  };

  const getPostalCodeLabel = () => {
    if (selectedCountry === 'US') return 'ZIP Code';
    if (selectedCountry === 'GB') return 'Postcode';
    return 'Postal Code';
  };

  // Themed styles
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

  // Form error styles
  const formStyles = isDark 
    ? `
      .onboarding-form .ant-form-item-explain-error {
        color: #FCA5A5 !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        font-weight: 500;
      }
      .onboarding-form .ant-form-item-has-error .ant-input,
      .onboarding-form .ant-form-item-has-error .ant-select-selector {
        border-color: #FCA5A5 !important;
      }
      .onboarding-form .ant-input::placeholder {
        color: rgba(255,255,255,0.4) !important;
      }
      .onboarding-form .ant-input-prefix {
        color: rgba(255,255,255,0.5) !important;
      }
      .onboarding-form .ant-select {
        height: 48px !important;
      }
      .onboarding-form .ant-select-selector {
        background: rgba(0,0,0,0.3) !important;
        border: 1px solid rgba(255,255,255,0.15) !important;
        border-radius: 12px !important;
        height: 48px !important;
        min-height: 48px !important;
        padding: 0 11px !important;
      }
      .onboarding-form .ant-select-selection-search-input {
        height: 46px !important;
      }
      .onboarding-form .ant-select-selection-item {
        color: #ffffff !important;
        line-height: 46px !important;
      }
      .onboarding-form .ant-select-selection-placeholder {
        line-height: 46px !important;
        color: rgba(255,255,255,0.4) !important;
      }
      .onboarding-form .ant-select-arrow {
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
      .onboarding-form .ant-form-item-has-error .ant-select-selector {
        border-color: #FFE066 !important;
      }
      .onboarding-form .ant-input::placeholder {
        color: rgba(0,0,0,0.35) !important;
      }
      .onboarding-form .ant-select {
        height: 48px !important;
      }
      .onboarding-form .ant-select-selector {
        background: rgba(255,255,255,0.9) !important;
        border: 1px solid rgba(255,255,255,0.5) !important;
        border-radius: 12px !important;
        height: 48px !important;
        min-height: 48px !important;
        padding: 0 11px !important;
      }
      .onboarding-form .ant-select-selection-search-input {
        height: 46px !important;
      }
      .onboarding-form .ant-select-selection-item {
        line-height: 46px !important;
        color: #1a1a2e !important;
      }
      .onboarding-form .ant-select-selection-placeholder {
        line-height: 46px !important;
        color: rgba(0,0,0,0.35) !important;
      }
      .onboarding-form .ant-select-arrow {
        color: rgba(0,0,0,0.4) !important;
      }
    `;

  if (pageLoading) {
    return (
      <>
        <Head>
          <title>Address - InTuition Exchange</title>
        </Head>
        <OnboardingLayout currentStep={1} title="Your Address" subtitle="Where do you currently live?">
          <Skeleton active paragraph={{ rows: 8 }} />
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
        showBack
        onBack={() => router.push('/onboarding/personal')}
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
            initialValues={{  }}
            className="onboarding-form"
          >
            {/* Street Address - full width */}
            <Form.Item
              name="street1"
              label={<span style={getLabelStyle()}>Street Address</span>}
              rules={[
                { required: true, message: 'Please enter your street address' },
                { max: 200, message: 'Address is too long' },
              ]}
              style={{ marginBottom: token.marginMD }}
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder="123 Main Street"
                style={getInputStyle()}
                disabled={loading}
              />
            </Form.Item>

            {/* Apt/Suite - full width */}
            <Form.Item
              name="street2"
              label={<span style={getLabelStyle()}>Apt, Suite, etc. <span style={{ fontWeight: 400, opacity: 0.7 }}>(Optional)</span></span>}
              rules={[{ max: 200, message: 'Address is too long' }]}
              style={{ marginBottom: token.marginMD }}
            >
              <Input
                placeholder="Apt 4B"
                style={getInputStyle()}
                disabled={loading}
              />
            </Form.Item>

            {/* Row 1: Country + City */}
            <Row gutter={token.marginSM}>
              <Col xs={12}>
                <Form.Item
                  name="country"
                  label={<span style={getLabelStyle()}>Country</span>}
                  rules={[{ required: true, message: 'Required', validator: (_, value) => value ? Promise.resolve() : Promise.reject('Required') }]}
                  style={{ marginBottom: token.marginMD }}
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
                        color: selectedCountry ? (isDark ? '#ffffff' : '#1a1a2e') : 'rgba(255,255,255,0.4)',
                      }}
                      value={selectedCountry}
                      disabled={loading}
                      onChange={(e) => {
                        form.setFieldsValue({ country: e.target.value, region: undefined });
                        setSelectedCountry(e.target.value);
                        setSelectedRegion('');
                      }}
                    >
                      <option value="">Select</option>
                      {countryOptions.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  ) : (
                    <Select
                      showSearch
                      placeholder="Select"
                      options={countryOptions}
                      disabled={loading}
                      onChange={handleCountryChange}
                      optionFilterProp="searchValue"
                      filterOption={filterOption}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  name="city"
                  label={<span style={getLabelStyle()}>City</span>}
                  rules={[
                    { required: true, message: 'Required' },
                    { max: 100, message: 'Too long' },
                  ]}
                  style={{ marginBottom: token.marginMD }}
                >
                  <Input
                    placeholder="City"
                    style={getInputStyle()}
                    disabled={loading}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Row 2: State + Postal Code */}
            <Row gutter={token.marginSM}>
              <Col xs={12}>
                <Form.Item
                  name="region"
                  label={<span style={getLabelStyle()}>{getRegionLabel()}</span>}
                  rules={[{ required: true, message: 'Required', validator: (_, value) => value ? Promise.resolve() : Promise.reject('Required') }]}
                  style={{ marginBottom: token.marginLG }}
                >
                  {hasStates ? (
                    isMobile ? (
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
                          color: selectedRegion ? (isDark ? '#ffffff' : '#1a1a2e') : 'rgba(255,255,255,0.4)',
                        }}
                        value={selectedRegion}
                        disabled={loading}
                        onChange={(e) => {
                          form.setFieldsValue({ region: e.target.value });
                          setSelectedRegion(e.target.value);
                        }}
                      >
                        <option value="">Select</option>
                        {stateOptions.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    ) : (
                      <Select
                        showSearch
                        placeholder="Select"
                        options={stateOptions}
                        disabled={loading}
                        filterOption={filterOption}
                      />
                    )
                  ) : (
                    <Input
                      placeholder={getRegionLabel()}
                      style={getInputStyle()}
                      disabled={loading}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  name="postalCode"
                  label={<span style={getLabelStyle()}>{getPostalCodeLabel()}</span>}
                  rules={[
                    { required: true, message: 'Required' },
                    { max: 20, message: 'Too long' },
                  ]}
                  style={{ marginBottom: token.marginLG }}
                >
                  <Input
                    placeholder={getPostalCodeLabel()}
                    style={getInputStyle()}
                    disabled={loading}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Buttons */}
            <Form.Item style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', gap: token.marginSM }}>
                <Button
                  size="large"
                  onClick={() => router.push('/onboarding/personal')}
                  style={{ ...getButtonStyle(false), flex: 1 }}
                >
                  <ArrowLeftOutlined />
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ ...getButtonStyle(), flex: 3 }}
                >
                  Continue <ArrowRightOutlined />
                </Button>
              </div>
            </Form.Item>
          </Form>
        </motion.div>
      </OnboardingLayout>
    </>
  );
}
