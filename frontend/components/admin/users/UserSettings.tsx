import React from 'react';
import {
  Descriptions,
  Tag,
  Typography,
  Empty,
  Table,
  Divider,
} from 'antd';
import {
  MailOutlined,
  MobileOutlined,
  BellOutlined,
  BankOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { FullAdminUser } from '../../../services/api/admin';

const { Text } = Typography;

interface UserSettingsProps {
  user: FullAdminUser;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ user }) => {
  const prefs = user.notificationPreferences;

  const renderBool = (value: boolean | undefined) =>
    value ? (
      <Tag color="green" icon={<CheckOutlined />}>On</Tag>
    ) : (
      <Tag icon={<CloseOutlined />}>Off</Tag>
    );

  const bankColumns = [
    { title: 'Account Name', dataIndex: 'accountName', key: 'accountName' },
    { title: 'Type', dataIndex: 'accountType', key: 'accountType', render: (t: string) => t?.toUpperCase() },
    { title: 'Last 4', dataIndex: 'accountNumber', key: 'accountNumber', render: (n: string) => `****${n}` },
    {
      title: 'Verified',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (v: boolean) => v ? <Tag color="green">Yes</Tag> : <Tag color="orange">No</Tag>,
    },
    { title: 'Added', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString() },
  ];

  return (
    <div>
      <Divider titlePlacement="start"><BellOutlined /> Notification Preferences</Divider>
      {prefs ? (
        <>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            <MailOutlined /> Email Notifications
          </Text>
          <Descriptions column={3} size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Marketing">{renderBool(prefs.emailMarketing)}</Descriptions.Item>
            <Descriptions.Item label="Security">{renderBool(prefs.emailSecurityAlerts)}</Descriptions.Item>
            <Descriptions.Item label="Transactions">{renderBool(prefs.emailTransactions)}</Descriptions.Item>
            <Descriptions.Item label="Price Alerts">{renderBool(prefs.emailPriceAlerts)}</Descriptions.Item>
            <Descriptions.Item label="News">{renderBool(prefs.emailNewsUpdates)}</Descriptions.Item>
          </Descriptions>

          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            <MobileOutlined /> Push Notifications
          </Text>
          <Descriptions column={3} size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Enabled">{renderBool(prefs.pushEnabled)}</Descriptions.Item>
            <Descriptions.Item label="Security">{renderBool(prefs.pushSecurityAlerts)}</Descriptions.Item>
            <Descriptions.Item label="Transactions">{renderBool(prefs.pushTransactions)}</Descriptions.Item>
            <Descriptions.Item label="Price Alerts">{renderBool(prefs.pushPriceAlerts)}</Descriptions.Item>
            <Descriptions.Item label="News">{renderBool(prefs.pushNewsUpdates)}</Descriptions.Item>
          </Descriptions>

          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            <MobileOutlined /> SMS Notifications
          </Text>
          <Descriptions column={3} size="small">
            <Descriptions.Item label="Enabled">{renderBool(prefs.smsEnabled)}</Descriptions.Item>
            <Descriptions.Item label="Security">{renderBool(prefs.smsSecurityAlerts)}</Descriptions.Item>
            <Descriptions.Item label="Transactions">{renderBool(prefs.smsTransactions)}</Descriptions.Item>
          </Descriptions>
        </>
      ) : (
        <Empty description="Using default notification settings" />
      )}

      <Divider titlePlacement="start"><BankOutlined /> Bank Accounts</Divider>
      {user.bankAccounts.length > 0 ? (
        <Table
          columns={bankColumns}
          dataSource={user.bankAccounts}
          rowKey="id"
          pagination={false}
          size="small"
        />
      ) : (
        <Empty description="No bank accounts linked" />
      )}

      <Divider titlePlacement="start">Account Timeline</Divider>
      <Descriptions column={2} size="small">
        <Descriptions.Item label="Created">{new Date(user.createdAt).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Updated">{new Date(user.updatedAt).toLocaleString()}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};
