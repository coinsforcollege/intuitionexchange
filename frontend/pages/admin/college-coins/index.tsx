import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Tag,
  Typography,
  Card,
  Image,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import {
  getCollegeCoins,
  deleteCollegeCoin,
  updateCollegeCoin,
  DemoCollegeCoin,
} from '../../../services/api/admin';

const { Text } = Typography;

export default function AdminCollegeCoinsPage() {
  const router = useRouter();
  const [coins, setCoins] = useState<DemoCollegeCoin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCoins = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCollegeCoins();
      setCoins(response.coins);
    } catch (error: any) {
      message.error(error.message || 'Failed to fetch college coins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const handleDelete = (id: string, ticker: string) => {
    Modal.confirm({
      title: `Delete ${ticker}?`,
      content: 'This action cannot be undone. Are you sure you want to delete this demo college coin?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteCollegeCoin(id);
          message.success(`${ticker} deleted successfully`);
          fetchCoins();
        } catch (error: any) {
          message.error(error.message || 'Failed to delete');
        }
      },
    });
  };

  const handleToggleActive = async (id: string, ticker: string, isActive: boolean) => {
    try {
      await updateCollegeCoin(id, { isActive });
      message.success(`${ticker} is now ${isActive ? 'active' : 'inactive'}`);
      fetchCoins();
    } catch (error: any) {
      message.error(error.message || 'Failed to update');
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return '-';
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const columns = [
    {
      title: 'Icon',
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      width: 60,
      render: (url: string | null, record: DemoCollegeCoin) =>
        url ? (
          <Image
            src={url}
            alt={record.ticker}
            width={32}
            height={32}
            style={{ borderRadius: 4 }}
            fallback="/images/default-token.png"
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 4,
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 'bold',
              color: '#999',
            }}
          >
            {record.ticker.substring(0, 2)}
          </div>
        ),
    },
    {
      title: 'Token',
      key: 'token',
      render: (_: any, record: DemoCollegeCoin) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.ticker}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Pegged To',
      key: 'pegged',
      render: (_: any, record: DemoCollegeCoin) => (
        <Space direction="vertical" size={0}>
          <Text>{record.peggedToAsset}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.peggedPercentage}%
          </Text>
        </Space>
      ),
    },
    {
      title: 'Current Price',
      key: 'price',
      render: (_: any, record: DemoCollegeCoin) => (
        <Space direction="vertical" size={0}>
          <Text strong>{formatPrice(record.currentPrice)}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Ref: {formatPrice(record.referencePrice)}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: string[]) =>
        categories.length > 0 ? (
          <Space wrap size={4}>
            {categories.slice(0, 2).map((cat) => (
              <Tag key={cat} color="blue">{cat}</Tag>
            ))}
            {categories.length > 2 && (
              <Tag>+{categories.length - 2}</Tag>
            )}
          </Space>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive: boolean, record: DemoCollegeCoin) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleActive(record.id, record.ticker, checked)}
        />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: DemoCollegeCoin) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => router.push(`/admin/college-coins/${record.id}`)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, record.ticker)}
          />
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout selectedKey="college-coins">
      <Card size="small" style={{ marginBottom: 16, background: 'transparent' }}>
        <Text type="secondary">
          Demo college coins are simulated tokens for <strong>Learner Mode</strong>. 
          They are pegged to real cryptocurrencies and allow users to practice trading without real money.
          These are NOT real tradeable assets.
        </Text>
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space>
          <Link href="/admin/college-coins/new">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Demo Token
            </Button>
          </Link>
          <Button icon={<ReloadOutlined />} onClick={fetchCoins}>
            Refresh
          </Button>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={coins}
        loading={loading}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showTotal: (t) => `Total ${t} tokens`,
        }}
      />
    </AdminLayout>
  );
}

