'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { theme, Form, Input, Button, message, Card, Typography, Space, Skeleton } from 'antd';
import {
  BankOutlined,
} from '@ant-design/icons';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { addBankAccount } from '@/services/api/fiat';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Link from 'next/link';

const { useToken } = theme;
const { Title, Text } = Typography;

// Initialize Stripe
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
const stripePromise = STRIPE_PUBLISHABLE_KEY && STRIPE_PUBLISHABLE_KEY.length > 0 
  ? loadStripe(STRIPE_PUBLISHABLE_KEY) 
  : null;

function AddBankAccountForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { token } = useToken();

  const handleSubmit = async (values: { accountName: string }) => {
    if (!stripe || !elements) {
      message.error('Stripe is not loaded');
      return;
    }

    setLoading(true);

    try {
      // Submit the elements to validate
      const { error: submitError, selectedPaymentMethod } = await elements.submit();
      
      if (submitError) {
        message.error(submitError.message || 'Please check your bank account details');
        setLoading(false);
        return;
      }

      if (!selectedPaymentMethod) {
        message.error('Failed to collect bank account details');
        setLoading(false);
        return;
      }

      // Add bank account to backend
      await addBankAccount(selectedPaymentMethod, values.accountName);
      
      message.success('Bank account added successfully');
      router.push('/portfolio/bank-accounts');
    } catch (error: any) {
      message.error(error.message || 'Failed to add bank account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Account Name"
        name="accountName"
        rules={[{ required: true, message: 'Please enter an account name' }]}
      >
        <Input
          placeholder="e.g., My Checking Account"
          size="large"
        />
      </Form.Item>

      <div style={{ marginBottom: token.marginMD }}>
        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
          Enter your bank account details below. This information is encrypted and secure.
        </Text>
      </div>

      <div style={{ marginBottom: token.marginLG }}>
        <PaymentElement
          options={{
            fields: {
              billingDetails: {
                name: 'never',
                email: 'never',
                phone: 'never',
                address: 'never',
              },
            },
          }}
        />
      </div>

      <Form.Item>
        <Space>
          <Button onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            Add Bank Account
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default function AddBankAccountPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user, isLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login?redirect=/portfolio/bank-accounts/add');
        return;
      }
      if (user.kycStatus !== 'APPROVED' && user.kycStatus !== 'PENDING') {
        router.push('/onboarding');
        return;
      }
      setPageLoading(false);
    }
  }, [user, isLoading, router]);

  // Don't render anything while checking auth or if not logged in
  if (isLoading || !user) {
    return null;
  }

  if (pageLoading) {
    return (
      <>
        <Head>
          <title>Add Bank Account - InTuition Exchange</title>
        </Head>
        <DashboardLayout activeKey="portfolio">
          <Skeleton active paragraph={{ rows: 8 }} />
        </DashboardLayout>
      </>
    );
  }

  // Check if Stripe is configured
  if (!STRIPE_PUBLISHABLE_KEY || !stripePromise) {
    return (
      <>
        <Head>
          <title>Add Bank Account - InTuition Exchange</title>
        </Head>
        <DashboardLayout activeKey="portfolio">
          <Card>
            <div style={{ textAlign: 'center', padding: token.paddingXL }}>
              <Text type="danger">
                Stripe is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env file.
              </Text>
            </div>
          </Card>
        </DashboardLayout>
      </>
    );
  }

  const options = {
    mode: 'setup' as const,
    currency: 'usd',
    paymentMethodTypes: ['us_bank_account'],
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <>
      <Head>
        <title>Add Bank Account - InTuition Exchange</title>
        <meta name="description" content="Add a new bank account for withdrawals" />
      </Head>

      <DashboardLayout activeKey="portfolio">
        {/* Breadcrumbs */}
        <div style={{ marginBottom: token.marginLG }}>
          <Space>
            <Link href="/portfolio" style={{ color: token.colorTextSecondary, textDecoration: 'none' }}>
              Portfolio
            </Link>
            <span style={{ color: token.colorTextTertiary }}>/</span>
            <Link href="/portfolio/bank-accounts" style={{ color: token.colorTextSecondary, textDecoration: 'none' }}>
              Bank Accounts
            </Link>
            <span style={{ color: token.colorTextTertiary }}>/</span>
            <span style={{ color: token.colorText }}>Add</span>
          </Space>
        </div>

        {/* Header */}
        <div style={{ marginBottom: token.marginXL }}>
          <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: token.marginSM }}>
            <BankOutlined />
            Add Bank Account
          </Title>
          <Text type="secondary" style={{ fontSize: token.fontSize }}>
            Add a bank account to enable withdrawals
          </Text>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <Elements stripe={stripePromise} options={options}>
              <AddBankAccountForm />
            </Elements>
          </Card>
        </motion.div>
      </DashboardLayout>
    </>
  );
}





