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
} from 'antd';
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
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
  const [kycFilter, setKycFilter] = useState<string | undefined>();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers({ page, limit, search, role: roleFilter, kycStatus: kycFilter });
      setUsers(response.users);
      setTotal(response.total);
    } catch (error: any) {
      message.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, roleFilter, kycFilter]);

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
      width: 110,
      render: (role: string, record: AdminUser) => (
        <Select
          value={role}
          size="small"
          style={{ width: 90 }}
          onChange={(value) => handleRoleChange(record.id, value as 'USER' | 'ADMIN')}
          options={[
            { value: 'USER', label: 'User' },
            { value: 'ADMIN', label: 'Admin' },
          ]}
        />
      ),
    },
    {
      title: 'Mode',
      dataIndex: 'appMode',
      key: 'appMode',
      width: 90,
      render: (mode: string) => (
        <Tag color={mode === 'LEARNER' ? 'blue' : 'green'}>{mode}</Tag>
      ),
    },
    {
      title: 'KYC',
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      width: 100,
      render: (status: string) => {
        const colors: Record<string, string> = {
          PENDING: 'orange',
          SUBMITTED: 'blue',
          APPROVED: 'green',
          REJECTED: 'red',
        };
        return <Tag color={colors[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Verified',
      key: 'verified',
      width: 120,
      render: (_: any, record: AdminUser) => (
        <Space size={4}>
          {record.emailVerified && <Tag color="green">Email</Tag>}
          {record.phoneVerified && <Tag color="green">Phone</Tag>}
          {!record.emailVerified && !record.phoneVerified && <Tag>None</Tag>}
        </Space>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '',
      key: 'actions',
      fixed: 'right' as const,
      width: 80,
      render: (_: any, record: AdminUser) => (
        <Link href={`/admin/users/${record.id}`}>
          <Button type="link" size="small" icon={<EyeOutlined />}>View</Button>
        </Link>
      ),
    },
  ];

  return (
    <AdminLayout selectedKey="users">
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search email, name, phone..."
          style={{ width: 280 }}
          onSearch={(value) => { setSearch(value); setPage(1); }}
          allowClear
        />
        <Select
          placeholder="Role"
          style={{ width: 100 }}
          allowClear
          onChange={(value) => { setRoleFilter(value); setPage(1); }}
          options={[
            { value: 'USER', label: 'User' },
            { value: 'ADMIN', label: 'Admin' },
          ]}
        />
        <Select
          placeholder="KYC"
          style={{ width: 110 }}
          allowClear
          onChange={(value) => { setKycFilter(value); setPage(1); }}
          options={[
            { value: 'PENDING', label: 'Pending' },
            { value: 'SUBMITTED', label: 'Submitted' },
            { value: 'APPROVED', label: 'Approved' },
            { value: 'REJECTED', label: 'Rejected' },
          ]}
        />
        <Button icon={<ReloadOutlined />} onClick={fetchUsers} loading={loading}>
          Refresh
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        size="small"
        scroll={{ x: 1000 }}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          showTotal: (t) => `${t} users`,
          onChange: (p, l) => { setPage(p); setLimit(l); },
        }}
      />
    </AdminLayout>
  );
}
