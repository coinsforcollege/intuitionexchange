'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { theme, Button, Card, Empty, message, Popconfirm, Space, Tag, Typography, Skeleton } from 'antd';
import {
  BankOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fontWeights } from '@/theme/themeConfig';
import { useAuth } from '@/context/AuthContext';
import { getBankAccounts, deleteBankAccount, type BankAccount } from '@/services/api/fiat';
import Link from 'next/link';

const { useToken } = theme;
const { Title, Text } = Typography;

export default function BankAccountsPage() {
  const router = useRouter();
  const { token } = useToken();
  const { user, isLoading: authLoading } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/portfolio/bank-accounts');
        return;
      }
      if (user.kycStatus !== 'APPROVED' && user.kycStatus !== 'PENDING') {
        router.push('/onboarding');
        return;
      }
      setPageLoading(false);
      loadBankAccounts();
    }
  }, [user, authLoading, router]);

  const loadBankAccounts = async () => {
    setLoading(true);
    try {
      const accounts = await getBankAccounts();
      setBankAccounts(accounts);
    } catch (error: any) {
      message.error('Failed to load bank accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accountId: string) => {
    try {
      await deleteBankAccount(accountId);
      message.success('Bank account deleted');
      loadBankAccounts();
    } catch (error: any) {
      message.error('Failed to delete bank account');
    }
  };

  if (pageLoading) {
    return (
      <>
        <Head>
          <title>Bank Accounts - InTuition Exchange</title>
        </Head>
        <DashboardLayout activeKey="portfolio">
          <Skeleton active paragraph={{ rows: 8 }} />
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Bank Accounts - InTuition Exchange</title>
        <meta name="description" content="Manage your bank accounts for withdrawals" />
      </Head>

      <DashboardLayout activeKey="portfolio">
        {/* Breadcrumbs */}
        <div style={{ marginBottom: token.marginLG }}>
          <Space>
            <Link href="/portfolio" style={{ color: token.colorTextSecondary, textDecoration: 'none' }}>
              Portfolio
            </Link>
            <span style={{ color: token.colorTextTertiary }}>/</span>
            <span style={{ color: token.colorText }}>Bank Accounts</span>
          </Space>
        </div>

        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: token.marginXL,
        }}>
          <div>
            <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: token.marginSM }}>
              <BankOutlined />
              Bank Accounts
            </Title>
            <Text type="secondary" style={{ fontSize: token.fontSize }}>
              Manage your bank accounts for withdrawals
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => router.push('/portfolio/bank-accounts/add')}
          >
            Add Bank Account
          </Button>
        </div>

        {/* Bank Accounts List */}
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : bankAccounts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <Empty
                description="No bank accounts added"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => router.push('/portfolio/bank-accounts/add')}
                >
                  Add Your First Bank Account
                </Button>
              </Empty>
            </Card>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: token.marginMD }}>
            {bankAccounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: token.borderRadius,
                    border: `1px solid ${token.colorBorderSecondary}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: token.marginSM,
                        marginBottom: token.marginXS,
                      }}>
                        <Title level={4} style={{ margin: 0 }}>
                          {account.accountName}
                        </Title>
                        {account.isVerified && (
                          <Tag color="success" icon={<CheckCircleOutlined />}>
                            Verified
                          </Tag>
                        )}
                        <Tag>{account.accountType}</Tag>
                      </div>
                      <div style={{ 
                        fontSize: token.fontSize,
                        color: token.colorTextSecondary,
                        fontFamily: 'monospace',
                      }}>
                        •••• {account.last4} • {account.routingNumber}
                      </div>
                    </div>
                    <Popconfirm
                      title="Delete bank account"
                      description="Are you sure you want to delete this bank account?"
                      onConfirm={() => handleDelete(account.id)}
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        type="text"
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </DashboardLayout>
    </>
  );
}





