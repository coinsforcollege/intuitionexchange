import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Input,
  Select,
  Tag,
  Button,
  Space,
  message,
  Modal,
  Typography,
  Card,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getUsers, updateUserRole, AdminUser } from '../../services/api/admin';

const { Search } = Input;
const { Text } = Typography;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers({ page, limit, search, role: roleFilter });
      setUsers(response.users);
      setTotal(response.total);
    } catch (error: any) {
      message.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    Modal.confirm({
      title: `Change role to ${newRole}?`,
      content: `Are you sure you want to change this user's role to ${newRole}?`,
      onOk: async () => {
        try {
          await updateUserRole(userId, newRole);
          message.success(`Role updated to ${newRole}`);
          fetchUsers();
        } catch (error: any) {
          message.error(error.message || 'Failed to update role');
        }
      },
    });
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: AdminUser) => (
        <Space direction="vertical" size={0}>
          <Text strong>
            {record.firstName || record.lastName
              ? `${record.firstName || ''} ${record.lastName || ''}`.trim()
              : '-'}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.email}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string, record: AdminUser) => (
        <Text>{record.phoneCountry} {phone}</Text>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: AdminUser) => (
        <Select
          value={role}
          style={{ width: 100 }}
          onChange={(value) => handleRoleChange(record.id, value as 'USER' | 'ADMIN')}
          options={[
            { value: 'USER', label: 'User' },
            { value: 'ADMIN', label: 'Admin' },
          ]}
        />
      ),
    },
    {
      title: 'App Mode',
      dataIndex: 'appMode',
      key: 'appMode',
      render: (mode: string) => (
        <Tag color={mode === 'LEARNER' ? 'blue' : 'green'}>
          {mode}
        </Tag>
      ),
    },
    {
      title: 'KYC Status',
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      render: (status: string) => {
        const colors: Record<string, string> = {
          PENDING: 'orange',
          APPROVED: 'green',
          REJECTED: 'red',
          NOT_STARTED: 'default',
        };
        return <Tag color={colors[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Verified',
      key: 'verified',
      render: (_: any, record: AdminUser) => (
        <Space>
          {record.emailVerified && <Tag color="green">Email</Tag>}
          {record.phoneVerified && <Tag color="green">Phone</Tag>}
          {!record.emailVerified && !record.phoneVerified && (
            <Tag color="default">None</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <AdminLayout selectedKey="users">
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space>
          <Search
            placeholder="Search by email, name, phone..."
            style={{ width: 300 }}
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
            allowClear
          />
          <Select
            placeholder="Filter by role"
            style={{ width: 120 }}
            allowClear
            onChange={(value) => {
              setRoleFilter(value);
              setPage(1);
            }}
            options={[
              { value: 'USER', label: 'User' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
            Refresh
          </Button>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          showTotal: (t) => `Total ${t} users`,
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          },
        }}
      />
    </AdminLayout>
  );
}

