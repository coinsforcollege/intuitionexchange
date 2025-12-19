import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Tabs,
  Spin,
  message,
  Button,
  Space,
  Typography,
  Breadcrumb,
  Tag,
  Avatar,
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  WalletOutlined,
  SwapOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import {
  UserOverview,
  UserBalances,
  UserTransactions,
  UserTrades,
  UserKyc,
  UserSettings,
} from '../../../components/admin/users';
import { getUser, FullAdminUser } from '../../../services/api/admin';

const { Title, Text } = Typography;

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<FullAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchUser = useCallback(async () => {
    if (!id || typeof id !== 'string') return;

    setLoading(true);
    try {
      const response = await getUser(id);
      setUser(response.user);
    } catch (error: any) {
      message.error(error.message || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleDeleted = () => {
    router.push('/admin/users');
  };

  if (loading || !id) {
    return (
      <AdminLayout selectedKey="users" hideHeader>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout selectedKey="users" hideHeader>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Title level={4}>User not found</Title>
          <Link href="/admin/users">
            <Button type="primary">Back to Users</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const userName =
    user.firstName || user.lastName
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      : user.email;

  const kycStatusColors: Record<string, string> = {
    PENDING: 'orange',
    SUBMITTED: 'blue',
    APPROVED: 'green',
    REJECTED: 'red',
  };

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <UserOutlined />
          Overview
        </span>
      ),
      children: <UserOverview user={user} onRefresh={fetchUser} onDeleted={handleDeleted} />,
    },
    {
      key: 'balances',
      label: (
        <span>
          <WalletOutlined />
          Balances
        </span>
      ),
      children: <UserBalances userId={user.id} />,
    },
    {
      key: 'transactions',
      label: (
        <span>
          <SwapOutlined />
          Transactions
        </span>
      ),
      children: <UserTransactions userId={user.id} />,
    },
    {
      key: 'trades',
      label: (
        <span>
          <LineChartOutlined />
          Trades
        </span>
      ),
      children: <UserTrades userId={user.id} />,
    },
    {
      key: 'kyc',
      label: (
        <span>
          <SafetyCertificateOutlined />
          KYC
        </span>
      ),
      children: <UserKyc user={user} onRefresh={fetchUser} />,
    },
    {
      key: 'settings',
      label: (
        <span>
          <SettingOutlined />
          Settings
        </span>
      ),
      children: <UserSettings user={user} />,
    },
  ];

  return (
    <AdminLayout selectedKey="users" hideHeader>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { title: <Link href="/admin/users">Users</Link> },
          { title: userName },
        ]}
        style={{ marginBottom: 16 }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Space align="center" size="middle">
          <Link href="/admin/users">
            <Button icon={<ArrowLeftOutlined />} type="text" />
          </Link>
          <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
            {(user.firstName?.[0] || user.email[0]).toUpperCase()}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Title level={4} style={{ margin: 0 }}>
              {userName}
            </Title>
            <Space size="small">
              <Text type="secondary">{user.email}</Text>
              <Tag color={user.role === 'ADMIN' ? 'purple' : 'default'}>{user.role}</Tag>
              <Tag color={user.appMode === 'INVESTOR' ? 'green' : 'blue'}>{user.appMode}</Tag>
              <Tag color={kycStatusColors[user.kycStatus]}>{user.kycStatus}</Tag>
            </Space>
          </Space>
        </Space>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        destroyInactiveTabPane
      />
    </AdminLayout>
  );
}

