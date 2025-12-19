import React from 'react';
import {
  Descriptions,
  Tag,
  Space,
  Button,
  Switch,
  Select,
  Popconfirm,
  message,
  Statistic,
  Row,
  Col,
  Divider,
  Typography,
} from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { FullAdminUser, updateUser, deleteUser } from '../../../services/api/admin';

const { Text, Title } = Typography;

interface UserOverviewProps {
  user: FullAdminUser;
  onRefresh: () => void;
  onDeleted: () => void;
}

export const UserOverview: React.FC<UserOverviewProps> = ({ user, onRefresh, onDeleted }) => {
  const [loading, setLoading] = React.useState(false);

  const handleToggleEmailVerified = async (checked: boolean) => {
    setLoading(true);
    try {
      await updateUser(user.id, { emailVerified: checked });
      message.success(`Email verification ${checked ? 'enabled' : 'disabled'}`);
      onRefresh();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePhoneVerified = async (checked: boolean) => {
    setLoading(true);
    try {
      await updateUser(user.id, { phoneVerified: checked });
      message.success(`Phone verification ${checked ? 'enabled' : 'disabled'}`);
      onRefresh();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (role: 'USER' | 'ADMIN') => {
    setLoading(true);
    try {
      await updateUser(user.id, { role });
      message.success(`Role updated to ${role}`);
      onRefresh();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppModeChange = async (appMode: 'LEARNER' | 'INVESTOR') => {
    setLoading(true);
    try {
      await updateUser(user.id, { appMode });
      message.success(`App mode updated to ${appMode}`);
      onRefresh();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(user.id);
      message.success('User deleted successfully');
      onDeleted();
    } catch (error: any) {
      message.error(error.message);
      setLoading(false);
    }
  };

  const kycStatusColors: Record<string, string> = {
    PENDING: 'orange',
    SUBMITTED: 'blue',
    APPROVED: 'green',
    REJECTED: 'red',
  };

  return (
    <div>
      {/* Stats Row */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Statistic
            title="Live Trades"
            value={user._count.trades}
            prefix={<SafetyCertificateOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Learner Trades"
            value={user._count.learnerTrades}
            prefix={<SafetyCertificateOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Fiat Transactions"
            value={user._count.fiatTransactions}
            prefix={<GlobalOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Crypto Transactions"
            value={user._count.cryptoTransactions}
            prefix={<GlobalOutlined />}
          />
        </Col>
      </Row>

      <Divider titlePlacement="start">Account Information</Divider>
      <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>ID: {user.id}</Text>
      
      <Descriptions column={2} size="small">
        <Descriptions.Item label={<><MailOutlined /> Email</>}>
          {user.email}
        </Descriptions.Item>
        <Descriptions.Item label="Email Verified">
          <Switch
            checked={user.emailVerified}
            onChange={handleToggleEmailVerified}
            loading={loading}
            checkedChildren="Yes"
            unCheckedChildren="No"
          />
        </Descriptions.Item>
        <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
          {user.phoneCountry} {user.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Phone Verified">
          <Switch
            checked={user.phoneVerified}
            onChange={handleTogglePhoneVerified}
            loading={loading}
            checkedChildren="Yes"
            unCheckedChildren="No"
          />
        </Descriptions.Item>
        <Descriptions.Item label={<><GlobalOutlined /> Country</>}>
          {user.country}
        </Descriptions.Item>
        <Descriptions.Item label="KYC Status">
          <Tag color={kycStatusColors[user.kycStatus] || 'default'}>
            {user.kycStatus}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Created">
          {new Date(user.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Updated">
          {new Date(user.updatedAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      <Divider titlePlacement="start">Role & Mode Settings</Divider>
      <Row gutter={48}>
        <Col span={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>User Role</Text>
            <Select
              value={user.role}
              onChange={handleRoleChange}
              style={{ width: 200 }}
              loading={loading}
              options={[
                { value: 'USER', label: 'User' },
                { value: 'ADMIN', label: 'Admin' },
              ]}
            />
            <Text type="secondary">
              Admins have access to the admin dashboard.
            </Text>
          </Space>
        </Col>
        <Col span={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>App Mode</Text>
            <Select
              value={user.appMode}
              onChange={handleAppModeChange}
              style={{ width: 200 }}
              loading={loading}
              options={[
                { value: 'LEARNER', label: 'Learner (Demo)' },
                { value: 'INVESTOR', label: 'Investor (Live)' },
              ]}
            />
            <Text type="secondary">
              Learner mode uses virtual funds.
            </Text>
          </Space>
        </Col>
      </Row>

      {/* Bank Accounts */}
      {user.bankAccounts.length > 0 && (
        <>
          <Divider titlePlacement="start">Bank Accounts</Divider>
          <Descriptions column={1} size="small">
            {user.bankAccounts.map((account) => (
              <Descriptions.Item
                key={account.id}
                label={
                  <Space>
                    {account.accountName}
                    <Tag color={account.isVerified ? 'green' : 'orange'}>
                      {account.isVerified ? 'Verified' : 'Unverified'}
                    </Tag>
                  </Space>
                }
              >
                {account.accountType} - ****{account.accountNumber}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </>
      )}

      {/* Danger Zone */}
      <Divider titlePlacement="start" style={{ borderColor: '#ff4d4f' }}>
        <Text type="danger">Danger Zone</Text>
      </Divider>
      <Space direction="vertical">
        <Text type="secondary">
          <ExclamationCircleOutlined /> Deleting a user is permanent. All associated data will be removed.
        </Text>
        <Popconfirm
          title="Delete User"
          description={`Are you sure you want to delete ${user.email}?`}
          onConfirm={handleDelete}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={loading}
            disabled={user.role === 'ADMIN'}
          >
            Delete User
          </Button>
        </Popconfirm>
        {user.role === 'ADMIN' && (
          <Text type="secondary">Admin users cannot be deleted.</Text>
        )}
      </Space>
    </div>
  );
};
